import type { Alarm } from '@location-alarm/shared';
import type { AlarmBlockReason, AlarmRegistrationState } from '@/components';

const createdAt = Date.parse('2026-09-01T00:00:00Z');

export const nativeAlarmFixtures: {
  repeat: Alarm;
  oneOff: Alarm;
  longName: Alarm;
} = {
  repeat: {
    id: 'fixture-repeat',
    label: '회사 앞에서 내리기',
    latitude: 37.4979,
    longitude: 127.0276,
    placeName: '강남역 2번 출구',
    radius: 500,
    enabled: true,
    repeat: true,
    repeatDays: [1, 2, 3, 4, 5],
    windowStart: '07:00',
    windowEnd: '10:00',
    soundId: 'default',
    vibrate: true,
    createdAt,
    updatedAt: createdAt,
    lastFiredAt: null,
  },
  oneOff: {
    id: 'fixture-one-off',
    label: '면접 보러 가는 길',
    latitude: 37.5008,
    longitude: 127.0366,
    placeName: '역삼역 5번 출구',
    radius: 600,
    enabled: false,
    repeat: false,
    repeatDays: [],
    windowStart: null,
    windowEnd: null,
    soundId: 'default',
    vibrate: true,
    createdAt,
    updatedAt: createdAt,
    lastFiredAt: Date.parse('2026-09-02T00:00:00Z'),
  },
  longName: {
    id: 'fixture-long-name',
    label: '퇴근길에 지나가는 환승역에서 꼭 내려서 다음 열차로 갈아타기',
    latitude: 37.5045,
    longitude: 127.0251,
    placeName: '신논현역',
    radius: 400,
    enabled: false,
    repeat: true,
    repeatDays: [0, 6],
    windowStart: '18:00',
    windowEnd: '21:00',
    soundId: 'default',
    vibrate: false,
    createdAt,
    updatedAt: createdAt,
    lastFiredAt: null,
  },
};

export const nativeCardScenarios: {
  name: string;
  alarm: Alarm;
  registrationState: AlarmRegistrationState;
  blockedReason?: AlarmBlockReason;
  firedToday?: boolean;
}[] = [
  {
    name: '반복 알람 등록됨',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'on',
  },
  {
    name: '오늘 울림',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'on',
    firedToday: true,
  },
  {
    name: '1회용 울리고 꺼짐',
    alarm: nativeAlarmFixtures.oneOff,
    registrationState: 'off',
  },
  {
    name: '긴 이름',
    alarm: nativeAlarmFixtures.longName,
    registrationState: 'off',
  },
  {
    name: '등록 중',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'registering',
  },
  {
    name: '등록 실패',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'error',
  },
  {
    name: '권한 거부',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'off',
    blockedReason: 'permission',
  },
  {
    name: '등록 한도',
    alarm: nativeAlarmFixtures.repeat,
    registrationState: 'off',
    blockedReason: 'limit',
  },
];
