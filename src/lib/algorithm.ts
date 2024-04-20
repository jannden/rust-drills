import { DateTime, Duration } from 'luxon'

import { AlgorithmInput, AlgorithmOutput } from '@/lib/types'
import { differenceInDays } from '@/lib/utils'
import { isLearnedIfIntervalDays } from './config/sr'

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
      // * MEANS DIFFICULT WHEN NEW
      // Repeat soon and reset repetition count
      exactInterval = Duration.fromObject({ days: 1 })
      repetition = 0
      fuzzedInterval = exactInterval // No fuzzing for failed learning phase
    } else if (numberOfMistakes === 0) {
      // * MEANS EASY WHEN NEW
      repetition = previousValues.repetition + 1
      // Never repeat again
      exactInterval = Duration.fromObject({ days: isLearnedIfIntervalDays })
      fuzzedInterval = exactInterval // No fuzzing for successful learning phase
    } else {
      throw new Error('numberOfMistakes in learning phase should be 0 or 1')
    }
  } else {
    // Reviewing phase

    if (numberOfMistakes === 1) {
      // * MEANS DIFFICULT WHEN REPEATED
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
      // * MEANS EASY WHEN REPEATED
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
      fuzzedInterval && fuzzedInterval?.as('days') > isLearnedIfIntervalDays
        ? Duration.fromObject({
            days: isLearnedIfIntervalDays,
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
