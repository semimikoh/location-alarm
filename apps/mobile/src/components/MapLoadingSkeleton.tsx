import { StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

export function MapLoadingSkeleton() {
  const colors = useAppColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
      accessibilityLabel="알람 생성 화면 준비 중"
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]} />
      <View style={[styles.map, { backgroundColor: colors.surface }]}>
        <AppText variant="body" color="textMuted">
          지도를 준비하고 있어요
        </AppText>
      </View>
      <View style={[styles.field, { backgroundColor: colors.surface }]} />
      <View style={[styles.field, { backgroundColor: colors.surface }]} />
      <View style={[styles.button, { backgroundColor: colors.accentSoft }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: space[4], gap: space[4] },
  header: { height: 48, borderRadius: radius.md },
  map: {
    flex: 1,
    minHeight: 220,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: { height: 56, borderRadius: radius.md },
  button: { height: 52, borderRadius: radius.md },
});
