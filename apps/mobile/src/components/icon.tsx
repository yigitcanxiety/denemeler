import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'back'
  | 'close'
  | 'share'
  | 'menu'
  | 'check'
  | 'arrow'
  | 'upload'
  | 'lock'
  | 'sparkle'
  | 'external'
  | 'refresh'
  | 'camera'
  | 'scan'
  | 'sun'
  | 'grid'
  | 'user'
  | 'palette'
  | 'brush'
  | 'drop'
  | 'contrast'
  | 'face'
  | 'eye'
  | 'chevronDown'
  | 'chevronRight'
  | 'globe'
  | 'trash'
  | 'shield'
  | 'sliders'
  | 'image'
  | 'alert';

/**
 * Simple line icons (stroke 1.75, lucide-style) drawn with react-native-svg. Decorative:
 * hidden from accessibility (the pressable around them carries the label).
 */
export function Icon({
  name,
  size = 20,
  color = colors.ink,
  strokeWidth = 1.75,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const c = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'back' ? <Path d="M15 5l-7 7 7 7" {...c} /> : null}
      {name === 'close' ? <Path d="M6 6l12 12M18 6L6 18" {...c} /> : null}
      {name === 'share' ? <Path d="M7 17L17 7M9 7h8v8" {...c} /> : null}
      {name === 'menu' ? <Path d="M5 8h14M5 12h14M5 16h14" {...c} /> : null}
      {name === 'check' ? <Path d="M5 12.5l4.5 4.5L19 7.5" {...c} /> : null}
      {name === 'arrow' ? <Path d="M5 12h14M13 6l6 6-6 6" {...c} /> : null}
      {name === 'upload' ? <Path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v5h16v-5" {...c} /> : null}
      {name === 'lock' ? (
        <>
          <Rect x={5} y={11} width={14} height={9.5} rx={2.5} {...c} />
          <Path d="M8.5 11V8a3.5 3.5 0 017 0v3" {...c} />
        </>
      ) : null}
      {name === 'sparkle' ? (
        <Path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" {...c} fill={color} />
      ) : null}
      {name === 'external' ? <Path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" {...c} /> : null}
      {name === 'refresh' ? <Path d="M19 12a7 7 0 11-2.05-4.95M19 4v4h-4" {...c} /> : null}
      {name === 'camera' ? (
        <>
          <Path d="M4 8.5A1.5 1.5 0 015.5 7h2.2l1.5-2h5.6l1.5 2h2.2A1.5 1.5 0 0120 8.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17.5z" {...c} />
          <Circle cx={12} cy={12.5} r={3.3} {...c} />
        </>
      ) : null}
      {name === 'scan' ? (
        <>
          <Path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" {...c} />
          <Circle cx={12} cy={12} r={3.2} {...c} />
        </>
      ) : null}
      {name === 'sun' ? (
        <>
          <Circle cx={12} cy={12} r={3.6} {...c} />
          <Path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" {...c} />
        </>
      ) : null}
      {name === 'grid' ? (
        <>
          <Rect x={4} y={4} width={6.5} height={6.5} rx={1.6} {...c} />
          <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.6} {...c} />
          <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.6} {...c} />
          <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={1.6} {...c} />
        </>
      ) : null}
      {name === 'user' ? (
        <>
          <Circle cx={12} cy={8.5} r={3.8} {...c} />
          <Path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" {...c} />
        </>
      ) : null}
      {name === 'palette' ? (
        <>
          <Path d="M12 3.5a8.5 8.5 0 100 17c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-.9.7-1.5 1.6-1.5h2A4.1 4.1 0 0020.5 10.6C20.5 6.6 16.7 3.5 12 3.5z" {...c} />
          <Circle cx={8} cy={11} r={1} {...c} />
          <Circle cx={11} cy={7.5} r={1} {...c} />
          <Circle cx={15.5} cy={8.5} r={1} {...c} />
        </>
      ) : null}
      {name === 'brush' ? (
        <>
          <Path d="M14.5 4.5l5 5-7.8 7.8-5-5z" {...c} />
          <Path d="M6.7 12.3c-2.2.4-3.2 2.3-3.2 4.2 0 1.5-.5 2.3-1 3 3.3.3 6.8-.4 8.2-2.2" {...c} />
        </>
      ) : null}
      {name === 'drop' ? <Path d="M12 3.5s6 6.2 6 10.5a6 6 0 01-12 0c0-4.3 6-10.5 6-10.5z" {...c} /> : null}
      {name === 'contrast' ? (
        <>
          <Circle cx={12} cy={12} r={8} {...c} />
          <Path d="M12 4a8 8 0 010 16z" {...c} fill={color} />
        </>
      ) : null}
      {name === 'face' ? (
        <>
          <Path d="M12 3.5c3.9 0 6.5 3.3 6.5 7.8 0 4.9-3.2 9.2-6.5 9.2s-6.5-4.3-6.5-9.2c0-4.5 2.6-7.8 6.5-7.8z" {...c} />
          <Path d="M9.5 11h.01M14.5 11h.01M10 15.5c1.2.8 2.8.8 4 0" {...c} />
        </>
      ) : null}
      {name === 'eye' ? (
        <>
          <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...c} />
          <Circle cx={12} cy={12} r={2.8} {...c} />
        </>
      ) : null}
      {name === 'chevronDown' ? <Path d="M6 9l6 6 6-6" {...c} /> : null}
      {name === 'chevronRight' ? <Path d="M9 6l6 6-6 6" {...c} /> : null}
      {name === 'globe' ? (
        <>
          <Circle cx={12} cy={12} r={8.5} {...c} />
          <Path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5s1.1-6.1 3.4-8.5z" {...c} />
        </>
      ) : null}
      {name === 'trash' ? <Path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.9 12.5h9.2L17.5 7M10 11v5M14 11v5" {...c} /> : null}
      {name === 'shield' ? (
        <>
          <Path d="M12 3.5l7 2.8v5.2c0 4.3-3 7.7-7 9-4-1.3-7-4.7-7-9V6.3z" {...c} />
          <Path d="M9 12l2.2 2.2L15.5 10" {...c} />
        </>
      ) : null}
      {name === 'sliders' ? (
        <>
          <Path d="M4 7h9M17 7h3M4 17h3M11 17h9" {...c} />
          <Circle cx={15} cy={7} r={2} {...c} />
          <Circle cx={9} cy={17} r={2} {...c} />
        </>
      ) : null}
      {name === 'image' ? (
        <>
          <Rect x={3.5} y={4.5} width={17} height={15} rx={2.5} {...c} />
          <Circle cx={9} cy={10} r={1.6} {...c} />
          <Path d="M20.5 16l-5-5-8.5 8.5" {...c} />
        </>
      ) : null}
      {name === 'alert' ? (
        <>
          <Path d="M12 4l9 16H3z" {...c} />
          <Path d="M12 10v4.5M12 17.2h.01" {...c} />
        </>
      ) : null}
    </Svg>
  );
}
