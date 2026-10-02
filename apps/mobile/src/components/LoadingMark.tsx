import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';
import { ActionButton } from './ActionButton';

type LoadingMarkProps = {
  message?: string;
  error?: string;
  onRetry?: () => void;
};

export function LoadingMark({
  message = '알람을 준비하고 있어요',
  error,
  onRetry,
}: LoadingMarkProps) {
  const colors = useAppColors();

  return (
    <View
      style={styles.container}
      accessibilityRole={error ? 'alert' : 'progressbar'}
      accessibilityLabel={error ?? message}
    >
      <Image
        source={require('../../assets/images/app-icon.png')}
        style={styles.icon}
        accessibilityLabel="위치 알람 아이콘"
      />
      <AppText variant="body" style={styles.center}>
        {error ?? message}
      </AppText>
      {error && onRetry ? (
        <ActionButton label="다시 시도" onPress={onRetry} />
      ) : error ? null : (
        <ActivityIndicator color={colors.accentInk} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[4],
    padding: space[8],
  },
  icon: { width: 88, height: 88, borderRadius: radius.lg },
  center: { textAlign: 'center' },
});
