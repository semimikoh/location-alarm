import type { Weekday } from '@location-alarm/shared';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

const labels = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function DaySummary({ days }: { days: readonly Weekday[] }) {
  const colors = useAppColors();
  const selected = new Set(days);

  return (
    <View
      accessibilityLabel={`반복 요일 ${days.map((day) => labels[day]).join(', ')}`}
      style={styles.row}
    >
      {labels.map((label, day) => (
        <View
          key={label}
          style={[
            styles.day,
            {
              backgroundColor: selected.has(day as Weekday)
                ? colors.accentSoft
                : colors.surface,
            },
          ]}
        >
          <AppText
            variant="caption"
            color={selected.has(day as Weekday) ? 'accentInk' : 'textMuted'}
          >
            {label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[1] },
  day: {
    minWidth: 24,
    minHeight: 24,
    paddingHorizontal: space[1],
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
