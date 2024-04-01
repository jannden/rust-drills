import { DateTime, Duration } from 'luxon'

import { AlgorithmInput, AlgorithmOutput } from '@/lib/types'
import { differenceInDays } from '@/lib/utils'

/**
 * This is the algorithm is based on the general ideas of SM-2
 * and makes these adjustments:
 *
 * - give bonus if card is reviewed late, but still remembered correctly
 * - don't adjust eFactor if card is being learned
 * - go back to "learning" stage if you fail a card, to avoid being punished
 *   each time you get it wrong
 * - review times are "fuzzed" to avoid bunching up the same cards in lessons
 */
export const spacedRepetitionAlgorithm = (
  previousValues: AlgorithmInput,
  numberOfMistakes: number
): AlgorithmOutput => {
  let repetition: number, eFactor: number, fuzzedInterval: Duration, exactInterval: Duration

  const lateness = differenceInDays(previousValues.dateTimePlanned)

  /*** Algorithm ***/

  if (previousValues.repetition < 3) {
    // Still in learning phase, so do not change eFactor
    eFactor = previousValues.eFactor

    if (numberOfMistakes === 2) {
      // Repeat almost immediately and reset repetition count
      exactInterval = Duration.fromObject({
        seconds: 600,
      })
      repetition = 0
      fuzzedInterval = exactInterval // No fuzzing for failed learning phase
    } else if (numberOfMistakes === 1) {
      repetition = previousValues.repetition + 1
      if (repetition === 1) {
        exactInterval = Duration.fromObject({ days: 3 })
      } else if (repetition === 2) {
        exactInterval = Duration.fromObject({ days: 5 })
      } else {
        exactInterval = Duration.fromObject({ days: 7 })
      }
      // Add 10% "fuzz" to interval to avoid bunching up reviews
      fuzzedInterval = Duration.fromObject({
        seconds: Math.ceil(exactInterval.as('seconds') * (1.0 + Math.random() * 0.1)),
      })
    } else {
      // TODO: Make this more wisely
      exactInterval = Duration.fromObject({ years: 10 })
      fuzzedInterval = exactInterval
      repetition = previousValues.repetition + 1
    }
  } else {
    // Reviewing phase

    if (numberOfMistakes === 2) {
      // Failed, so force re-review almost immediately and reset repetition count
      exactInterval = Duration.fromObject({
        seconds: 600,
      })
      repetition = 0

      // Reduce eFactor
      eFactor = Math.max(1.3, previousValues.eFactor - 0.2)
    } else if (numberOfMistakes === 0) {
      // Repeat never
      exactInterval = Duration.fromObject({ years: 10 })
      fuzzedInterval = exactInterval
      repetition = previousValues.repetition + 1
      eFactor = previousValues.eFactor
    } else {
      // Passed, so adjust eFactor and compute interval

      // First see if this was done close to on time or late. We handle early reviews differently
      // because Fresh Cards allows you to review cards as many times as you'd like, outside of
      // the SRS schedule. See details below in the "early" section.

      if (lateness >= -0.1) {
        // Review was not too early, so handle normally

        repetition = previousValues.repetition + 1

        let latenessMistakesBonus = 0
        let intervalAdjustment = 1.0

        // If this review was done late and user still got it right, give a slight bonus to the numberOfMistakes of up to 1.0.
        // This means if a card was hard to remember AND it was late, the eFactor should be unchanged. On the other
        // hand, if the card was easy, we should bump up the eFactor by even more than normal.
        if (lateness >= 0.1) {
          // Lateness factor is a function of previous interval length. The longer
          // previous interval, the harder it is to get a lateness bonus.
          // This ranges from 0.0 to 1.0.
          let latenessFactor = Math.min(1.0, lateness)

          // numberOfMistakes factor can range from 1.0 to 1.5
          let mistakesFactor = 1.0 + (numberOfMistakes - 3.0) / 4.0

          // Bonus can range from 0.0 to 1.0.
          latenessMistakesBonus = 1.0 * latenessFactor * mistakesFactor
        } else {
          // Card wasn't late, so adjust differently

          if (numberOfMistakes >= 3.0 && numberOfMistakes < 4) {
            // hard card, so adjust interval slightly
            intervalAdjustment = 0.8
          }
        }

        let adjustedMistakes = latenessMistakesBonus + numberOfMistakes
        eFactor = Math.max(
          1.3,
          previousValues.eFactor + (0.1 - (5 - adjustedMistakes) * (0.08 + (5 - adjustedMistakes) * 0.02))
        )

        // Figure out interval. First review is in 2d, then 6d, then based on eFactor and previous interval.
        if (previousValues.repetition === 0) {
          exactInterval = Duration.fromObject({ days: 2 })
        } else if (previousValues.repetition === 1) {
          exactInterval = Duration.fromObject({ days: 6 })
        } else {
          exactInterval = Duration.fromObject({
            days: Math.ceil(previousValues.interval * intervalAdjustment * eFactor),
          })
        }
      } else {
        // Card was reviewed "too early". We should not progress the SRS
        // schedule too quickly if you review early. If we didn't handle this case, what would happen
        // is if you review a card multiple times in the same day, it would progress the schedule and
        // might make the card due next in 30 days, which doesn't make sense. Just because you reviewed
        // it frequently doesn't mean you have committed to memory stronger. It still takes a few days
        // for it to sink it.

        // Therefore, what this section does is does a weighted average of the previous interval
        // with the interval in the future had you reviewed it on time instead of early. The weighting
        // function gives greater weight to the previous interval period if you review too early,
        // and as we approach the actual due date, we weight the next interval more. This ensures
        // we don't progress through the schedule too quickly if you review a card frequently.

        // Still increment the 'repetition' value as it really has no effect on 'reviewing stage' cards.
        repetition = previousValues.repetition + 1

        // Figure out the weight for the previous and next intervals.
        // First, normalize the lateness factor into a range of 0.0 to 1.0 instead of -1.0 to 0.0
        // (which indicates how early the review is).
        const earliness = 1.0 + lateness
        // min(e^(earliness^2) - 1.0), 1.0) gives us a nice weighted curve. You can plot it on a
        // site like fooplot.com. As we get closer to the true deadline, the future is given more
        // weight.
        const futureWeight = Math.min(Math.exp(earliness * earliness) - 1.0, 1.0)
        const currentWeight = 1.0 - futureWeight

        // Next we take the numberOfMistakes at this time and extrapolate what that numberOfMistakes may be in the
        // future, using the weighting function. Essentially, if you reviewed 5.0 today, we will
        // decay that numberOfMistakes down to a minimum of 3.0 in the future. Something easily remembered
        // now may not be easily remembered in the future.
        const predictedFutureMistakes = currentWeight * numberOfMistakes + futureWeight * 3.0

        // Compute the future eFactor and interval using the future numberOfMistakes
        const futureEfactor = Math.max(
          1.3,
          previousValues.eFactor + (0.1 - (5 - predictedFutureMistakes) * (0.08 + (5 - predictedFutureMistakes) * 0.02))
        )

        // Figure out interval. First review is in 1d, then 6d, then based on eFactor and previous interval.
        let futureIntervalDays
        if (previousValues.repetition === 0) {
          futureIntervalDays = 1
        } else if (previousValues.repetition === 1) {
          futureIntervalDays = 6
        } else {
          futureIntervalDays = Math.ceil(previousValues.interval * futureEfactor)
        }

        // Finally, combine the previous and next eFactor and intervals
        eFactor = previousValues.eFactor * currentWeight + futureEfactor * futureWeight
        exactInterval = Duration.fromObject({
          days: Math.ceil(previousValues.interval * currentWeight + futureIntervalDays * futureWeight),
        })
      }
    }

    // Add 5% "fuzz" to interval to avoid bunching up reviews
    fuzzedInterval = Duration.fromObject({
      seconds: Math.ceil(exactInterval.as('seconds') * (1.0 + Math.random() * 0.05)),
    })
  }

  let newDateTimePlanned = ''
  if (fuzzedInterval) {
    newDateTimePlanned = DateTime.utc().plus(fuzzedInterval).toISO() || ''
  } else {
    throw new Error('fuzzedInterval is undefined')
  }

  return {
    repetition,
    eFactor,
    interval: fuzzedInterval?.as('days') || 0,
    dateTimePlanned: newDateTimePlanned,
  }
}
