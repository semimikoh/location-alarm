import { tokens } from '@location-alarm/shared';
import { useColorScheme } from 'react-native';

export const { space, radius, typography } = tokens;
export type AppColors = typeof tokens.color.light;

export function useAppColors(): AppColors {
  return tokens.color[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
