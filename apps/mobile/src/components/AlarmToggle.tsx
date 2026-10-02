import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

export type AlarmRegistrationState = 'off' | 'on' | 'registering' | 'error';
export type AlarmBlockReason = 'permission' | 'limit' | null;

type AlarmToggleProps = {
  label: string;
  state: AlarmRegistrationState;
  blockedReason?: AlarmBlockReason;
  onRequestToggle: (enabled: boolean) => void;
  onBlocked?: (reason: Exclude<AlarmBlockReason, null>) => void;
};

export function AlarmToggle({
  label,
  state,
  blockedReason = null,
  onRequestToggle,
  onBlocked,
}: AlarmToggleProps) {
  const colors = useAppColors();
  const isOn = state === 'on' && blockedReason === null;
  const isBusy = state === 'registering';
  const status = blockedReason
    ? blockedReason === 'permission'
      ? '위치 권한 필요'
      : '등록 한도 도달'
    : state === 'registering'
      ? '등록 중'
      : state === 'error'
        ? '등록 실패'
        : isOn
          ? '켜짐'
          : '꺼짐';

  function handlePress() {
    if (blockedReason) {
      onBlocked?.(blockedReason);
      return;
    }
    onRequestToggle(!isOn);
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityValue={{ text: status }}
      accessibilityState={{ checked: isOn, disabled: isBusy, busy: isBusy }}
      disabled={isBusy}
      onPress={handlePress}
      style={styles.touchTarget}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: isOn ? colors.toggleOn : colors.border },
        ]}
      >
        <View
          style={[
            styles.thumb,
            { backgroundColor: colors.bg },
            isOn ? styles.thumbOn : null,
          ]}
        />
      </View>
      <AppText
        variant="caption"
        color={state === 'error' ? 'danger' : 'textMuted'}
      >
        {status}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    minWidth: 72,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
  },
  track: {
    width: 48,
    height: 28,
    padding: 3,
    borderRadius: radius.full,
    justifyContent: 'center',
  },
  thumb: { width: 22, height: 22, borderRadius: radius.full },
  thumbOn: { alignSelf: 'flex-end' },
});
