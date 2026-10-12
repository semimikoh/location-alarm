import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const alarms = sqliteTable(
  'alarms',
  {
    id: text('id').primaryKey().notNull(),
    label: text('label').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    placeName: text('place_name').notNull(),
    radius: integer('radius').notNull().default(500),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
    repeat: integer('repeat', { mode: 'boolean' }).notNull().default(true),
    repeatDays: text('repeat_days').notNull().default('[1,2,3,4,5]'),
    windowStart: text('window_start'),
    windowEnd: text('window_end'),
    soundId: text('sound_id').notNull().default('default'),
    vibrate: integer('vibrate', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    lastFiredAt: integer('last_fired_at'),
  },
  (table) => [
    check('alarms_label_not_empty', sql`length(trim(${table.label})) > 0`),
    check(
      'alarms_place_name_not_empty',
      sql`length(trim(${table.placeName})) > 0`,
    ),
    check(
      'alarms_latitude_range',
      sql`${table.latitude} >= -90 AND ${table.latitude} <= 90`,
    ),
    check(
      'alarms_longitude_range',
      sql`${table.longitude} >= -180 AND ${table.longitude} <= 180`,
    ),
    check(
      'alarms_radius_range',
      sql`${table.radius} >= 200 AND ${table.radius} <= 2000`,
    ),
    check('alarms_enabled_boolean', sql`${table.enabled} IN (0, 1)`),
    check('alarms_repeat_boolean', sql`${table.repeat} IN (0, 1)`),
    check('alarms_vibrate_boolean', sql`${table.vibrate} IN (0, 1)`),
    check(
      'alarms_repeat_schedule',
      sql`(${table.repeat} = 1 AND ${table.repeatDays} <> '[]' AND ${table.windowStart} GLOB '[0-2][0-9]:[0-5][0-9]' AND CAST(substr(${table.windowStart}, 1, 2) AS INTEGER) <= 23 AND ${table.windowEnd} GLOB '[0-2][0-9]:[0-5][0-9]' AND CAST(substr(${table.windowEnd}, 1, 2) AS INTEGER) <= 23 AND (CAST(substr(${table.windowStart}, 1, 2) AS INTEGER) * 60 + CAST(substr(${table.windowStart}, 4, 2) AS INTEGER)) < (CAST(substr(${table.windowEnd}, 1, 2) AS INTEGER) * 60 + CAST(substr(${table.windowEnd}, 4, 2) AS INTEGER))) OR (${table.repeat} = 0 AND ${table.repeatDays} = '[]' AND ${table.windowStart} IS NULL AND ${table.windowEnd} IS NULL)`,
    ),
  ],
);

export type AlarmRow = typeof alarms.$inferSelect;
export type NewAlarmRow = typeof alarms.$inferInsert;
