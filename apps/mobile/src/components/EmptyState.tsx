import { StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { space } from '@/ui/theme';
import { ActionButton } from './ActionButton';

type EmptyStateProps = {
  onAdd: () => void;
};

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText
        variant="display"
        color="accentInk"
        accessibilityLabel="위치 알람"
      >
        ◎
      </AppText>
      <AppText variant="title" style={styles.center}>
        아직 알람이 없어요
      </AppText>
      <AppText variant="body" color="textMuted" style={styles.center}>
        내릴 정류장을 지도에서 찍어두면 그 근처에 왔을 때 깨워드려요
      </AppText>
      <ActionButton label="알람 추가" onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[8],
    gap: space[3],
  },
  center: { textAlign: 'center' },
});
