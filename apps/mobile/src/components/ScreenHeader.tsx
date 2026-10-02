import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/ui/AppText';
import { space } from '@/ui/theme';

type HeaderAction = { label: string; onPress: () => void };

type ScreenHeaderProps = {
  title: string;
  size?: 'title' | 'display';
  align?: 'start' | 'center';
  leading?: HeaderAction;
  trailing?: HeaderAction;
};

export function ScreenHeader({
  title,
  size = 'title',
  align = 'center',
  leading,
  trailing,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View
        style={[
          styles.actionSlot,
          align === 'start' && !leading ? styles.collapsed : null,
        ]}
      >
        {leading ? (
          <Pressable
            accessibilityRole="button"
            onPress={leading.onPress}
            style={styles.action}
          >
            <AppText variant="label" color="accentInk">
              {leading.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <AppText
        variant={size}
        style={[styles.title, align === 'start' ? styles.startTitle : null]}
        accessibilityRole="header"
      >
        {title}
      </AppText>
      <View
        style={[
          styles.actionSlot,
          styles.trailing,
          align === 'start' && !trailing ? styles.collapsed : null,
        ]}
      >
        {trailing ? (
          <Pressable
            accessibilityRole="button"
            onPress={trailing.onPress}
            style={styles.action}
          >
            <AppText variant="label" color="accentInk">
              {trailing.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 60,
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSlot: { minWidth: 64 },
  collapsed: { minWidth: 0 },
  action: { minHeight: 44, justifyContent: 'center' },
  trailing: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
  startTitle: { textAlign: 'left' },
});
