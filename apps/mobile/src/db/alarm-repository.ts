import { and, desc, eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import type { Alarm, AlarmDraft, Weekday } from '@location-alarm/shared';
import { validateAlarmDraft } from '@location-alarm/shared';
import { getDatabase } from './client';
import { alarms } from './schema';

type AlarmRow = typeof alarms.$inferSelect;

export class AlarmValidationError extends Error {
  constructor(readonly errors: ReturnType<typeof validateAlarmDraft>) {
    super('알람 정보를 확인해 주세요.');
    this.name = 'AlarmValidationError';
  }
}

export class AlarmNotFoundError extends Error {
  constructor(id: string) {
    super(`알람을 찾을 수 없어요: ${id}`);
    this.name = 'AlarmNotFoundError';
  }
}

const createRequests = new Map<string, Promise<Alarm>>();

function toAlarm(row: AlarmRow): Alarm {
  const repeatDays = JSON.parse(row.repeatDays) as Weekday[];
  const fields = {
    id: row.id,
    label: row.label,
    latitude: row.latitude,
    longitude: row.longitude,
    placeName: row.placeName,
    radius: row.radius,
    enabled: row.enabled,
    soundId: row.soundId,
    vibrate: row.vibrate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastFiredAt: row.lastFiredAt,
  };

  if (row.repeat) {
    if (row.windowStart === null || row.windowEnd === null) {
      throw new Error(`반복 알람의 시간대가 비어 있어요: ${row.id}`);
    }
    return {
      ...fields,
      repeat: true,
      repeatDays,
      windowStart: row.windowStart,
      windowEnd: row.windowEnd,
    };
  }

  return {
    ...fields,
    repeat: false,
    repeatDays: [],
    windowStart: null,
    windowEnd: null,
  };
}

function validate(draft: AlarmDraft) {
  const errors = validateAlarmDraft(draft);
  if (Object.keys(errors).length > 0) throw new AlarmValidationError(errors);
}

function toValues(draft: AlarmDraft, now: number) {
  return {
    label: draft.label.trim(),
    latitude: draft.latitude as number,
    longitude: draft.longitude as number,
    placeName: draft.placeName.trim(),
    radius: draft.radius,
    enabled: draft.enabled,
    repeat: draft.repeat,
    repeatDays: JSON.stringify(draft.repeatDays),
    windowStart: draft.repeat ? draft.windowStart : null,
    windowEnd: draft.repeat ? draft.windowEnd : null,
    soundId: draft.soundId.trim(),
    vibrate: draft.vibrate,
    updatedAt: now,
  };
}

function requestKey(draft: AlarmDraft) {
  const { id: _id, ...content } = draft;
  return JSON.stringify(content);
}

/** Concurrent submissions with identical form content share one insert. */
export function createAlarm(draft: AlarmDraft): Promise<Alarm> {
  validate(draft);
  const key = requestKey(draft);
  const pending = createRequests.get(key);
  if (pending) return pending;

  const operation = (async () => {
    const db = await getDatabase();
    const now = Date.now();
    const [row] = await db
      .insert(alarms)
      .values({
        id: Crypto.randomUUID(),
        ...toValues(draft, now),
        createdAt: now,
        lastFiredAt: null,
      })
      .returning();
    if (!row) throw new Error('알람을 저장하지 못했어요.');
    return toAlarm(row);
  })();

  createRequests.set(key, operation);
  void operation.then(
    () => createRequests.delete(key),
    () => createRequests.delete(key),
  );
  return operation;
}

export async function listAlarms(): Promise<Alarm[]> {
  const db = await getDatabase();
  const rows = await db.select().from(alarms).orderBy(desc(alarms.createdAt));
  return rows.map(toAlarm);
}

export async function getAlarm(id: string): Promise<Alarm | null> {
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(alarms)
    .where(eq(alarms.id, id))
    .limit(1);
  return row ? toAlarm(row) : null;
}

export async function updateAlarm(
  id: string,
  draft: AlarmDraft,
): Promise<Alarm> {
  validate(draft);
  const db = await getDatabase();
  const existing = await getAlarm(id);
  if (!existing) throw new AlarmNotFoundError(id);

  const reactivatingFiredOneOff =
    !existing.repeat &&
    !existing.enabled &&
    existing.lastFiredAt !== null &&
    !draft.repeat &&
    draft.enabled;
  const [row] = await db
    .update(alarms)
    .set({
      ...toValues(draft, Date.now()),
      ...(reactivatingFiredOneOff ? { lastFiredAt: null } : {}),
    })
    .where(eq(alarms.id, id))
    .returning();
  if (!row) throw new AlarmNotFoundError(id);
  return toAlarm(row);
}

export async function setAlarmEnabled(
  id: string,
  enabled: boolean,
): Promise<Alarm> {
  const db = await getDatabase();
  const existing = await getAlarm(id);
  if (!existing) throw new AlarmNotFoundError(id);

  const shouldResetOneOff =
    enabled && !existing.repeat && existing.lastFiredAt !== null;
  const [row] = await db
    .update(alarms)
    .set({
      enabled,
      updatedAt: Date.now(),
      ...(shouldResetOneOff ? { lastFiredAt: null } : {}),
    })
    .where(and(eq(alarms.id, id), eq(alarms.enabled, existing.enabled)))
    .returning();

  if (!row)
    throw new Error('알람 상태가 변경됐어요. 목록을 새로고침해 주세요.');
  return toAlarm(row);
}

export async function deleteAlarm(id: string): Promise<void> {
  const db = await getDatabase();
  const deleted = await db
    .delete(alarms)
    .where(eq(alarms.id, id))
    .returning({ id: alarms.id });
  if (deleted.length === 0) throw new AlarmNotFoundError(id);
}
