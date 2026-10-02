import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';
import { ActionButton } from './ActionButton';

type LimitSheetProps = {
  visible: boolean;
  enabledCount: number;
  limit: number;
  onClose: () => void;
  onViewEnabled: () => void;
};

export function LimitSheet({
  visible,
  enabledCount,
  limit,
  onClose,
  onViewEnabled,
}: LimitSheetProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[styles.overlay, { backgroundColor: `${colors.alarmBg}A6` }]}
      >
        <Pressable
          accessibilityLabel="닫기"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          style={[styles.sheet, { backgroundColor: colors.bg }]}
          contentContainerStyle={[
            styles.sheetContent,
            { paddingBottom: space[6] + insets.bottom },
          ]}
        >
          <AppText variant="title">켤 수 있는 알람은 {limit}개까지예요</AppText>
          <AppText color="textMuted">
            지금 {enabledCount}개가 켜져 있어요. 이 알람을 켜려면 다른 알람
            하나를 먼저 꺼야 해요.
          </AppText>
          <ActionButton label="켜진 알람 보기" onPress={onViewEnabled} />
          <ActionButton label="나중에" variant="secondary" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    flexGrow: 0,
    maxHeight: '90%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  sheetContent: {
    padding: space[6],
    gap: space[4],
  },
});
