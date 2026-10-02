import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

type StatusBannerProps = {
  tone: 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
};

export function StatusBanner({
  tone,
  title,
  description,
  action,
}: StatusBannerProps) {
  const colors = useAppColors();
  const ink =
    tone === 'error'
      ? colors.danger
      : tone === 'warning'
        ? colors.warning
        : colors.accentInk;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        { backgroundColor: colors.accentSoft, borderColor: ink },
      ]}
    >
      <AppText variant="label" style={{ color: ink }}>
        {title}
      </AppText>
      {description ? <AppText variant="caption">{description}</AppText> : null}
      {action ? (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          style={styles.action}
        >
          <AppText variant="label" style={{ color: ink }}>
            {action.label} ›
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.md,
    borderLeftWidth: 3,
    padding: space[4],
    gap: space[2],
  },
  action: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
});
