import { tokens, type Alarm } from '@location-alarm/shared';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const alarms: Alarm[] = [];
const { color, space, typography } = tokens;

export default function AlarmListScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>알람</Text>
      </View>
      {alarms.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>아직 알람이 없어요</Text>
          <Text style={styles.emptyDescription}>
            내릴 장소를 지정하면 근처에 왔을 때 알려드려요.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.light.bg,
  },
  header: {
    paddingHorizontal: space[6],
    paddingVertical: space[5],
  },
  title: {
    color: color.light.text,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: String(typography.display.fontWeight) as '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[8],
    gap: space[2],
  },
  emptyTitle: {
    color: color.light.text,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyDescription: {
    color: color.light.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
