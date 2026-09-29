import { Text, type TextProps } from 'react-native';

import { typography } from '@/theme';

type Variant = keyof typeof typography;

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/** Themed text. Inter Tight for display/body, JetBrains Mono for annotations (system fallback). */
export function AppText({ variant = 'body', color, align, style, ...rest }: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[typography[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
    />
  );
}
