import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'back'
  | 'close'
  | 'share'
  | 'settings'
  | 'check'
  | 'arrow'
  | 'upload'
  | 'lock'
  | 'spark'
  | 'external'
  | 'refresh';

/** Minimal single-weight line icons (react-native-svg, no icon font). Decorative: hidden from a11y. */
export function Icon({ name, size = 20, color = colors.ink, strokeWidth = 1.7 }: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'back' ? <Path d="M15 5l-7 7 7 7" {...common} /> : null}
      {name === 'close' ? <Path d="M6 6l12 12M18 6L6 18" {...common} /> : null}
      {name === 'share' ? <Path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v7.5h14V12" {...common} /> : null}
      {name === 'settings' ? (
        <>
          <Path d="M4 7h9M17 7h3M4 17h3M11 17h9" {...common} />
          <Circle cx={15} cy={7} r={2} {...common} />
          <Circle cx={9} cy={17} r={2} {...common} />
        </>
      ) : null}
      {name === 'check' ? <Path d="M5 12.5l4.5 4.5L19 7.5" {...common} /> : null}
      {name === 'arrow' ? <Path d="M4 12h15M13 6l6 6-6 6" {...common} /> : null}
      {name === 'upload' ? <Path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" {...common} /> : null}
      {name === 'lock' ? (
        <>
          <Path d="M5.5 11h13v9h-13z" {...common} />
          <Path d="M8.5 11V8a3.5 3.5 0 017 0v3" {...common} />
        </>
      ) : null}
      {name === 'spark' ? <Path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" {...common} /> : null}
      {name === 'external' ? <Path d="M8 16L17 7M9 7h8v8" {...common} /> : null}
      {name === 'refresh' ? <Path d="M19 12a7 7 0 11-2.05-4.95M19 4v4h-4" {...common} /> : null}
    </Svg>
  );
}
