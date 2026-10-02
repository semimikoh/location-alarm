import type { Alarm } from '@location-alarm/shared';
import { ScrollView, StyleSheet, View } from 'react-native';
import { space } from '@/ui/theme';
import { ActionButton } from './ActionButton';
import { AlarmCard } from './AlarmCard';
import type { AlarmRegistrationState } from './AlarmToggle';
import { StatusBanner } from './StatusBanner';

type EmergencyAlarmListProps = {
  alarms: readonly Alarm[];
  registrationState: (alarm: Alarm) => AlarmRegistrationState;
  onRequestToggle: (alarm: Alarm, enabled: boolean) => void;
  onRetry: () => void;
};

export function EmergencyAlarmList({
  alarms,
  registrationState,
  onRequestToggle,
  onRetry,
}: EmergencyAlarmListProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <StatusBanner
        tone="error"
        title="알람 생성 화면을 열지 못했어요"
        description="기존 알람은 목록에서 확인하고 끌 수 있어요."
      />
      <ActionButton label="다시 열기" onPress={onRetry} />
      <View style={styles.list}>
        {alarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            alarm={alarm}
            registrationState={registrationState(alarm)}
            onRequestToggle={(enabled) => onRequestToggle(alarm, enabled)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space[4], gap: space[4] },
  list: { gap: space[3] },
});
