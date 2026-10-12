import { ALARM_RADIUS, isValidTimeWindow, WEEKDAYS } from './alarm';
import type { AlarmDraft } from './alarm';

export type AlarmDraftErrors = Partial<
  Record<
    | 'label'
    | 'placeName'
    | 'latitude'
    | 'longitude'
    | 'radius'
    | 'repeatDays'
    | 'windowStart'
    | 'windowEnd'
    | 'soundId',
    string
  >
>;

export function validateAlarmDraft(draft: AlarmDraft): AlarmDraftErrors {
  const errors: AlarmDraftErrors = {};

  if (!draft.label.trim()) errors.label = '알람 이름을 입력해 주세요.';
  if (!draft.placeName.trim()) errors.placeName = '장소를 선택해 주세요.';
  if (
    typeof draft.latitude !== 'number' ||
    !Number.isFinite(draft.latitude) ||
    draft.latitude < -90 ||
    draft.latitude > 90
  ) {
    errors.latitude = '위도는 -90부터 90 사이여야 해요.';
  }
  if (
    typeof draft.longitude !== 'number' ||
    !Number.isFinite(draft.longitude) ||
    draft.longitude < -180 ||
    draft.longitude > 180
  ) {
    errors.longitude = '경도는 -180부터 180 사이여야 해요.';
  }
  if (
    !Number.isInteger(draft.radius) ||
    draft.radius < ALARM_RADIUS.min ||
    draft.radius > ALARM_RADIUS.max
  ) {
    errors.radius = `반경은 ${ALARM_RADIUS.min}~${ALARM_RADIUS.max}m 사이여야 해요.`;
  }
  if (!draft.soundId.trim()) errors.soundId = '알람 소리를 선택해 주세요.';

  if (draft.repeat) {
    const validDays = new Set<number>(WEEKDAYS);
    if (
      draft.repeatDays.length === 0 ||
      draft.repeatDays.some((day) => !validDays.has(day)) ||
      new Set(draft.repeatDays).size !== draft.repeatDays.length
    ) {
      errors.repeatDays = '반복할 요일을 중복 없이 선택해 주세요.';
    }
    if (!isValidTimeWindow(draft.windowStart, draft.windowEnd)) {
      errors.windowStart = '시간대는 올바른 형식이며 종료보다 빨라야 해요.';
      errors.windowEnd = '시간대는 올바른 형식이며 시작보다 늦어야 해요.';
    }
  } else if (
    draft.repeatDays.length !== 0 ||
    draft.windowStart !== null ||
    draft.windowEnd !== null
  ) {
    errors.repeatDays = '1회용 알람에는 반복 요일과 시간대를 설정할 수 없어요.';
  }

  return errors;
}
