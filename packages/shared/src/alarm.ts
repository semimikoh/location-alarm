/** Local weekday number: Sunday = 0, Saturday = 6. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAYS: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const ALARM_RADIUS = {
  min: 200,
  default: 500,
  max: 2000,
} as const;

/** HH:mm in the device's local time; validate external values with parseClockTime. */
export type ClockTime = string;

export function parseClockTime(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function isValidTimeWindow(start: string, end: string): boolean {
  const startMinutes = parseClockTime(start);
  const endMinutes = parseClockTime(end);
  return (
    startMinutes !== null && endMinutes !== null && startMinutes < endMinutes
  );
}

type AlarmFields = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  placeName: string;
  radius: number;
  enabled: boolean;
  soundId: string;
  vibrate: boolean;
  /** UTC epoch milliseconds; repeat checks use the device's local calendar day. */
  createdAt: number;
  updatedAt: number;
  lastFiredAt: number | null;
};

type RepeatSchedule = {
  repeat: true;
  repeatDays: Weekday[];
  windowStart: ClockTime;
  windowEnd: ClockTime;
};

type OneOffSchedule = {
  repeat: false;
  repeatDays: [];
  windowStart: null;
  windowEnd: null;
};

export type Alarm = AlarmFields & (RepeatSchedule | OneOffSchedule);

/** In-progress form state. Coordinates may be missing until a place is chosen. */
export type AlarmDraft = Pick<
  AlarmFields,
  'label' | 'placeName' | 'radius' | 'soundId' | 'vibrate'
> & {
  id: string | null;
  latitude: number | null;
  longitude: number | null;
  enabled: boolean;
} & (RepeatSchedule | OneOffSchedule);
