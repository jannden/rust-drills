import { DateTime } from 'luxon'

export const algorithmDefaults = {
  repetition: 0,
  eFactor: 2.5,
  interval: 0,
  dateTimePlanned: DateTime.utc().toISO(),
}
