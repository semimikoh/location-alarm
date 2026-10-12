export {
  ALARM_RADIUS,
  WEEKDAYS,
  isValidTimeWindow,
  parseClockTime,
} from './alarm';
export type { Alarm, AlarmDraft, ClockTime, Weekday } from './alarm';
export { validateAlarmDraft } from './alarm-validation';
export type { AlarmDraftErrors } from './alarm-validation';

import tokenValues from '../tokens.json';

export const tokens = tokenValues;
export type Theme = keyof typeof tokens.color;
