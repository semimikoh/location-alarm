import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlarmListScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>알람</Text>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>아직 알람이 없어요</Text>
        <Text style={styles.emptyDescription}>
          내릴 장소를 지정하면 근처에 왔을 때 알려드려요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    color: '#14171A',
    fontSize: 32,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    color: '#14171A',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyDescription: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
