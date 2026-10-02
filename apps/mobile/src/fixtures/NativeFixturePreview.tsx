import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionButton,
  AlarmCard,
  DaySummary,
  EmergencyAlarmList,
  EmptyState,
  LimitSheet,
  LoadingMark,
  MapLoadingSkeleton,
  ScreenHeader,
  SettingsRow,
  StatusBanner,
} from '@/components';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';
import { nativeAlarmFixtures, nativeCardScenarios } from './native';

type NativeFixturePreviewProps = { onClose: () => void };

export function NativeFixturePreview({ onClose }: NativeFixturePreviewProps) {
  const colors = useAppColors();
  const [showLimit, setShowLimit] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  function showFixtureNotice() {
    Alert.alert('미리보기', '실제 알람이나 위치 감시는 변경되지 않아요.');
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScreenHeader
        title="네이티브 컴포넌트"
        align="start"
        leading={{ label: '닫기', onPress: onClose }}
      />
      {showEmergency ? (
        <View style={styles.screen}>
          <EmergencyAlarmList
            alarms={[nativeAlarmFixtures.repeat, nativeAlarmFixtures.oneOff]}
            registrationState={(alarm) => (alarm.enabled ? 'on' : 'off')}
            onRequestToggle={showFixtureNotice}
            onRetry={() => setShowEmergency(false)}
          />
          <View style={styles.footer}>
            <ActionButton
              label="컴포넌트로 돌아가기"
              variant="secondary"
              onPress={() => setShowEmergency(false)}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <AppText variant="caption" color="textMuted">
            개발용 fixture · 버튼과 토글은 저장하거나 감시를 시작하지 않아요
          </AppText>

          <Section title="버튼과 상태" backgroundColor={colors.surface}>
            <ActionButton label="기본 버튼" onPress={showFixtureNotice} />
            <ActionButton
              label="보조 버튼"
              variant="secondary"
              onPress={showFixtureNotice}
            />
            <ActionButton
              label="삭제 버튼"
              variant="destructive"
              onPress={showFixtureNotice}
            />
            <ActionButton
              label="사용 불가"
              disabled
              onPress={showFixtureNotice}
            />
            <ActionButton label="저장 중" busy onPress={showFixtureNotice} />
          </Section>

          <Section title="상태 안내" backgroundColor={colors.surface}>
            <StatusBanner tone="info" title="위치를 확인하고 있어요" />
            <StatusBanner
              tone="warning"
              title="위치 권한이 필요해요"
              description="설정에서 위치 접근을 허용해주세요."
              action={{ label: '설정 보기', onPress: showFixtureNotice }}
            />
            <StatusBanner
              tone="error"
              title="알람 등록에 실패했어요"
              action={{ label: '다시 시도', onPress: showFixtureNotice }}
            />
          </Section>

          <Section title="알람 카드와 토글" backgroundColor={colors.surface}>
            {nativeCardScenarios.map((scenario) => (
              <View key={scenario.name} style={styles.scenario}>
                <AppText variant="label" color="textMuted">
                  {scenario.name}
                </AppText>
                <AlarmCard
                  alarm={scenario.alarm}
                  registrationState={scenario.registrationState}
                  blockedReason={scenario.blockedReason}
                  firedToday={scenario.firedToday}
                  onPress={showFixtureNotice}
                  onRequestToggle={showFixtureNotice}
                  onBlocked={showFixtureNotice}
                />
              </View>
            ))}
            <DaySummary days={[0, 2, 4, 6]} />
          </Section>

          <Section title="설정과 한도" backgroundColor={colors.surface}>
            <SettingsRow
              label="위치 권한"
              value="허용 안 됨"
              onPress={showFixtureNotice}
            />
            <SettingsRow label="기본 반경" value="500m" />
            <ActionButton
              label="등록 한도 보기"
              variant="secondary"
              onPress={() => setShowLimit(true)}
            />
          </Section>

          <Section title="빈 목록" backgroundColor={colors.surface}>
            <View style={styles.emptyFrame}>
              <EmptyState onAdd={showFixtureNotice} />
            </View>
          </Section>

          <Section title="로딩과 오류" backgroundColor={colors.surface}>
            <LoadingMark />
            <LoadingMark
              error="알람을 불러오지 못했어요"
              onRetry={showFixtureNotice}
            />
            <View style={styles.mapFrame}>
              <MapLoadingSkeleton />
            </View>
          </Section>

          <Section title="비상 목록" backgroundColor={colors.surface}>
            <ActionButton
              label="비상 목록 보기"
              variant="secondary"
              onPress={() => setShowEmergency(true)}
            />
          </Section>
        </ScrollView>
      )}
      <LimitSheet
        visible={showLimit}
        enabledCount={20}
        limit={20}
        onClose={() => setShowLimit(false)}
        onViewEnabled={() => setShowLimit(false)}
      />
    </SafeAreaView>
  );
}

type SectionProps = {
  title: string;
  backgroundColor: string;
  children: React.ReactNode;
};

function Section({ title, backgroundColor, children }: SectionProps) {
  return (
    <View style={[styles.section, { backgroundColor }]}>
      <AppText variant="title">{title}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space[4], paddingBottom: space[10], gap: space[4] },
  section: { padding: space[4], borderRadius: radius.lg, gap: space[3] },
  scenario: { gap: space[1] },
  emptyFrame: { height: 320 },
  mapFrame: { height: 560 },
  footer: { padding: space[4] },
});
