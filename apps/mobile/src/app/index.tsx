import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton, EmptyState, ScreenHeader } from '@/components';
import { NativeFixturePreview } from '@/fixtures/NativeFixturePreview';
import { useAppColors } from '@/ui/theme';

export default function AlarmListScreen() {
  const colors = useAppColors();
  const [showFixtures, setShowFixtures] = useState(false);

  if (__DEV__ && showFixtures) {
    return <NativeFixturePreview onClose={() => setShowFixtures(false)} />;
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScreenHeader title="알람" size="display" align="start" />
      <EmptyState
        onAdd={() =>
          Alert.alert('알람 생성', '알람 생성 화면을 준비하고 있어요.')
        }
      />
      {__DEV__ ? (
        <View style={styles.previewButton}>
          <ActionButton
            label="컴포넌트 확인"
            variant="secondary"
            onPress={() => setShowFixtures(true)}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  previewButton: { padding: 16 },
});
