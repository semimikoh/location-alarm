import { useCallback, useRef, useState } from 'react';
import type { Alarm } from '@location-alarm/shared';
import { useFocusEffect } from 'expo-router';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionButton,
  AlarmCard,
  EmptyState,
  LoadingMark,
  ScreenHeader,
  StatusBanner,
} from '@/components';
import {
  deleteAlarm,
  listAlarms,
  setAlarmEnabled,
} from '@/db/alarm-repository';
import { NativeFixturePreview } from '@/fixtures/NativeFixturePreview';
import { space, useAppColors } from '@/ui/theme';

function firedToday(alarm: Alarm): boolean {
  return (
    alarm.lastFiredAt !== null &&
    new Date(alarm.lastFiredAt).toDateString() === new Date().toDateString()
  );
}

function showActionError() {
  Alert.alert('변경하지 못했어요', '잠시 후 다시 시도해 주세요.');
}

export default function AlarmListScreen() {
  const colors = useAppColors();
  const [showFixtures, setShowFixtures] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const busyIdsRef = useRef(new Set<string>());
  const loadVersion = useRef(0);

  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    try {
      const stored = await listAlarms();
      if (version === loadVersion.current) {
        setAlarms(stored);
        setLoadError(false);
      }
    } catch {
      if (version === loadVersion.current) setLoadError(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
      return () => {
        loadVersion.current += 1;
      };
    }, [load]),
  );

  function beginChange(id: string): boolean {
    if (busyIdsRef.current.has(id)) return false;
    busyIdsRef.current.add(id);
    setBusyIds(new Set(busyIdsRef.current));
    loadVersion.current += 1;
    return true;
  }

  function endChange(id: string) {
    busyIdsRef.current.delete(id);
    setBusyIds(new Set(busyIdsRef.current));
  }

  async function changeEnabled(id: string, enabled: boolean) {
    if (!beginChange(id)) return;
    try {
      const updated = await setAlarmEnabled(id, enabled);
      setAlarms(
        (current) =>
          current?.map((alarm) => (alarm.id === id ? updated : alarm)) ?? null,
      );
    } catch {
      showActionError();
      void load();
    } finally {
      endChange(id);
    }
  }

  async function remove(id: string) {
    if (!beginChange(id)) return;
    try {
      await deleteAlarm(id);
      setAlarms(
        (current) => current?.filter((alarm) => alarm.id !== id) ?? null,
      );
    } catch {
      showActionError();
      void load();
    } finally {
      endChange(id);
    }
  }

  function confirmDelete(alarm: Alarm) {
    Alert.alert('알람 삭제', `“${alarm.label}” 알람을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => void remove(alarm.id),
      },
    ]);
  }

  function showAddNotice() {
    Alert.alert('알람 생성', '알람 생성 화면을 준비하고 있어요.');
  }

  if (__DEV__ && showFixtures) {
    return <NativeFixturePreview onClose={() => setShowFixtures(false)} />;
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScreenHeader title="알람" size="display" align="start" />
      {loadError ? (
        <View style={styles.center}>
          <LoadingMark
            error="알람을 불러오지 못했어요"
            onRetry={() => void load()}
          />
        </View>
      ) : alarms === null ? (
        <View style={styles.center}>
          <LoadingMark message="알람을 불러오고 있어요" />
        </View>
      ) : alarms.length === 0 ? (
        <EmptyState onAdd={showAddNotice} />
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(alarm) => alarm.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <StatusBanner
              tone="info"
              title="위치 감시 준비 중"
              description="알람 설정은 저장됩니다. 실제 위치 감시는 다음 단계에서 연결돼요."
            />
          }
          renderItem={({ item }) => (
            <AlarmCard
              alarm={item}
              registrationState="off"
              firedToday={firedToday(item)}
              saving={busyIds.has(item.id)}
              onRequestToggle={(enabled) =>
                void changeEnabled(item.id, enabled)
              }
              onDelete={() => confirmDelete(item)}
            />
          )}
          ListFooterComponent={
            <ActionButton label="알람 추가" onPress={showAddNotice} />
          }
        />
      )}
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
  center: { flex: 1, justifyContent: 'center' },
  list: { padding: space[4], paddingBottom: space[8], gap: space[3] },
  previewButton: { padding: space[4] },
});
