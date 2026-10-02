import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  busy?: boolean;
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  busy = false,
}: ActionButtonProps) {
  const colors = useAppColors();
  const unavailable = disabled || busy;
  const backgroundColor =
    variant === 'primary'
      ? colors.accentInk
      : variant === 'destructive'
        ? colors.danger
        : colors.surface;
  const foregroundColor =
    variant === 'secondary' ? colors.text : colors.onAccent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: unavailable, busy }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: colors.border,
          opacity: unavailable ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {busy ? <ActivityIndicator color={foregroundColor} /> : null}
      <AppText variant="label" style={{ color: foregroundColor }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
});
