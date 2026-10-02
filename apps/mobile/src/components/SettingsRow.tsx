import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '@/ui/AppText';
import { space, useAppColors } from '@/ui/theme';

type SettingsRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
};

export function SettingsRow({ label, value, onPress }: SettingsRowProps) {
  const colors = useAppColors();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.row, { borderBottomColor: colors.border }]}
    >
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="label" color="textMuted" style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {onPress ? (
        <AppText variant="body" color="textMuted">
          ›
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingVertical: space[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderBottomWidth: 1,
  },
  label: { flex: 1 },
  value: { flexShrink: 1, textAlign: 'right' },
});
