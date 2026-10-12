import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingMark } from '@/components/LoadingMark';
import { initializeDatabase } from '@/db/client';
import { useAppColors } from '@/ui/theme';

type StartupState = 'loading' | 'ready' | 'error';

export default function RootLayout() {
  const colors = useAppColors();
  const [startupState, setStartupState] = useState<StartupState>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    initializeDatabase().then(
      () => {
        if (active) setStartupState('ready');
      },
      () => {
        if (active) setStartupState('error');
      },
    );

    return () => {
      active = false;
    };
  }, [attempt]);

  if (startupState !== 'ready') {
    return (
      <SafeAreaView
        style={[styles.startupScreen, { backgroundColor: colors.bg }]}
      >
        {startupState === 'error' ? (
          <LoadingMark
            error="알람 저장 공간을 준비하지 못했어요"
            onRetry={() => {
              setStartupState('loading');
              setAttempt((value) => value + 1);
            }}
          />
        ) : (
          <LoadingMark message="알람 저장 공간을 준비하고 있어요" />
        )}
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  startupScreen: { flex: 1 },
});
