import type { Alarm } from '@location-alarm/shared';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';
import {
  AlarmToggle,
  type AlarmBlockReason,
  type AlarmRegistrationState,
} from './AlarmToggle';
import { DaySummary } from './DaySummary';

type AlarmCardProps = {
  alarm: Alarm;
  registrationState: AlarmRegistrationState;
  blockedReason?: AlarmBlockReason;
  onPress?: () => void;
  onRequestToggle: (enabled: boolean) => void;
  onBlocked?: (reason: Exclude<AlarmBlockReason, null>) => void;
  firedToday?: boolean;
  saving?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function AlarmCard({
  alarm,
  registrationState,
  blockedReason = null,
  onPress,
  onRequestToggle,
  onBlocked,
  firedToday = false,
  saving = false,
  onEdit,
  onDelete,
}: AlarmCardProps) {
  const colors = useAppColors();
  const isInactive = registrationState !== 'on' || blockedReason !== null;
  const status =
    registrationState === 'error'
      ? '등록에 실패했어요'
      : firedToday && alarm.repeat
        ? alarm.enabled
          ? '오늘 울림 · 내일 다시'
          : '오늘 울림 · 현재 꺼짐'
        : !alarm.repeat && alarm.lastFiredAt !== null && !alarm.enabled
          ? '한 번 울리고 꺼짐'
          : registrationState === 'registering'
            ? '위치 감시 등록 중'
            : alarm.enabled &&
                isInactive &&
                registrationState === 'off' &&
                blockedReason === null
              ? '위치 감시 준비 중'
              : isInactive
                ? '감시 중이 아님'
                : null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole={onPress ? 'button' : 'text'}
          accessibilityLabel={`${alarm.label} 상세 보기`}
          disabled={!onPress}
          onPress={onPress}
          style={styles.details}
        >
          <AppText variant="body" style={styles.name}>
            {alarm.label}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {alarm.placeName} · {alarm.radius}m
          </AppText>
        </Pressable>
        <AlarmToggle
          label={`${alarm.label} 알람`}
          state={registrationState}
          enabled={alarm.enabled}
          saving={saving}
          blockedReason={blockedReason}
          onRequestToggle={onRequestToggle}
          onBlocked={onBlocked}
        />
      </View>
      {alarm.repeat ? (
        <View style={styles.schedule}>
          <AppText variant="caption" color="textMuted">
            {alarm.windowStart} – {alarm.windowEnd}
          </AppText>
          <DaySummary days={alarm.repeatDays} />
        </View>
      ) : (
        <AppText variant="caption" color="accentInk">
          1회용
        </AppText>
      )}
      {status ? (
        <AppText
          variant="caption"
          color={registrationState === 'error' ? 'danger' : 'textMuted'}
        >
          {status}
        </AppText>
      ) : null}
      {onEdit || onDelete ? (
        <View style={styles.actions}>
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${alarm.label} 수정`}
              accessibilityState={{ disabled: saving }}
              disabled={saving}
              onPress={onEdit}
              style={styles.action}
            >
              <AppText variant="label" color="accentInk">
                수정
              </AppText>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${alarm.label} 삭제`}
              accessibilityState={{ disabled: saving }}
              disabled={saving}
              onPress={onDelete}
              style={styles.action}
            >
              <AppText variant="label" color="danger">
                삭제
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space[4],
    borderWidth: 1,
    borderRadius: radius.lg,
    gap: space[2],
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  details: { flex: 1, minHeight: 44, justifyContent: 'center', gap: space[1] },
  name: { fontWeight: '600' },
  schedule: { gap: space[2] },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space[4],
  },
  action: {
    minHeight: 44,
    justifyContent: 'center',
  },
});
