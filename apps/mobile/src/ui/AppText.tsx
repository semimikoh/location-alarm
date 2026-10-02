import { tokens } from '@location-alarm/shared';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useAppColors } from './theme';

type TypeVariant = Exclude<keyof typeof tokens.typography, 'fontFamily'>;
type TextColor = keyof typeof tokens.color.light;

type AppTextProps = TextProps & {
  variant?: TypeVariant;
  color?: TextColor;
};

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  ...props
}: AppTextProps) {
  const colors = useAppColors();
  const type = tokens.typography[variant];

  const textStyle: TextStyle = {
    color: colors[color],
    fontFamily: tokens.typography.fontFamily,
    fontSize: type.fontSize,
    lineHeight: type.lineHeight,
    fontWeight: String(type.fontWeight) as TextStyle['fontWeight'],
    letterSpacing: type.fontSize * type.letterSpacingEm,
  };

  return <Text {...props} style={[textStyle, style]} />;
}
