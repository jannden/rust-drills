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

  const maxEFactor = 1.3
  let eFactorAdjustmentSmall = 0.1
  let eFactorAdjustmentNormal = 0.2
  let eFactorAdjustmentBig = 0.3
  const sevenDays = 7
  const lateness = differenceInDays(previousValues.dateTimePlanned)

  /*** Algorithm ***/

  if (previousValues.repetition < 3) {
    // Still in learning phase, so do not change eFactor
    eFactor = previousValues.eFactor

    if (numberOfMistakes === 1) {
      // * MEANS DIFFICULT
      // Repeat soon and reset repetition count
      exactInterval = Duration.fromObject({ days: 1 })
      repetition = 0
      fuzzedInterval = exactInterval // No fuzzing for failed learning phase
    } else if (numberOfMistakes === 0) {
      // * MEANS EASY
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
      throw new Error('numberOfMistakes in learning phase should be 0 or 1')
    }
  } else {
    // Reviewing phase

    if (numberOfMistakes === 1) {
      // * Difficult
      // Failed, so force re-review almost immediately and reset repetition count
      exactInterval = Duration.fromObject({ days: 1 })
      repetition = 0

      // If a card was hard to remember AND it was late, the eFactor should be less decreased.
      if (lateness > sevenDays) {
        eFactor = Math.max(maxEFactor, previousValues.eFactor - eFactorAdjustmentSmall)
      } else {
        // Reduce eFactor
        eFactor = Math.max(maxEFactor, previousValues.eFactor - eFactorAdjustmentNormal)
      }
    } else {
      // * Easy
      // Passed, so adjust eFactor and compute interval

      repetition = previousValues.repetition + 1

      // If the card was easy AND it was late, we should bump up the eFactor by even more.
      if (lateness > sevenDays) {
        eFactor = Math.max(maxEFactor, previousValues.eFactor + eFactorAdjustmentBig)
      } else {
        eFactor = Math.max(maxEFactor, previousValues.eFactor + eFactorAdjustmentNormal)
      }

      // Figure out new interval based on eFactor
      exactInterval = Duration.fromObject({
        days: Math.ceil(previousValues.interval * eFactor),
      })
    }

    // Add 5% "fuzz" to interval to avoid bunching up reviews
    fuzzedInterval = Duration.fromObject({
      seconds: Math.ceil(exactInterval.as('seconds') * (1.0 + Math.random() * 0.05)),
    })
  }

  let newDateTimePlanned = ''
  if (fuzzedInterval) {
    // Don't allow to overflow the interval
    fuzzedInterval =
      fuzzedInterval && fuzzedInterval?.as('days') > 1000
        ? Duration.fromObject({
            days: 1000,
          })
        : fuzzedInterval

    // Parse the new date
    newDateTimePlanned = DateTime.utc().plus(fuzzedInterval).toISO() || ''
  } else {
    throw new Error('fuzzedInterval is undefined')
  }

  return {
    repetition,
    eFactor: parseFloat(eFactor.toFixed(3)),
    interval: parseFloat(fuzzedInterval?.as('days').toFixed(3) || '0'),
    dateTimePlanned: newDateTimePlanned,
  }
}
