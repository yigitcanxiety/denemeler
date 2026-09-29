import { useWindowDimensions, View } from 'react-native';
import Svg, { Ellipse, Line, Path } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * Oval face-framing guide: dashed hairline oval, accent corner ticks and a crosshair.
 * As an overlay it fills the screen and dims everything outside the oval.
 */
export function FaceGuide({
  overlay,
  width,
  height,
  tone,
}: {
  overlay?: boolean;
  width?: number;
  height?: number;
  /** Line colour; defaults to light over the camera, ink on paper. */
  tone?: 'light' | 'ink';
}) {
  const window = useWindowDimensions();
  const ovalW = width ?? Math.min(window.width * 0.68, 300);
  const ovalH = height ?? ovalW * 1.32;

  const W = overlay ? window.width : ovalW + 56;
  const H = overlay ? window.height : ovalH + 56;
  const cx = W / 2;
  const cy = overlay ? H * 0.45 : H / 2;
  const rx = ovalW / 2;
  const ry = ovalH / 2;
  const light = tone ? tone === 'light' : !!overlay;
  const line = light ? 'rgba(239,233,227,0.9)' : colors.ink;
  const faint = light ? 'rgba(239,233,227,0.35)' : colors.lineStrong;
  const tick = 18;
  const l = cx - rx - 10;
  const r = cx + rx + 10;
  const t = cy - ry - 10;
  const b = cy + ry + 10;

  return (
    <View
      style={overlay ? { flex: 1 } : { width: W, height: H }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      <Svg width={W} height={H}>
        {overlay ? (
          <Path
            d={`M0 0H${W}V${H}H0Z M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`}
            fill="rgba(22,16,16,0.55)"
            fillRule="evenodd"
          />
        ) : null}
        {/* crosshair */}
        <Line x1={cx} y1={t - 26} x2={cx} y2={b + 26} stroke={faint} strokeWidth={0.75} />
        <Line x1={l - 26} y1={cy} x2={r + 26} y2={cy} stroke={faint} strokeWidth={0.75} />
        <Line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke={colors.accent} strokeWidth={1.2} />
        <Line x1={cx} y1={cy - 7} x2={cx} y2={cy + 7} stroke={colors.accent} strokeWidth={1.2} />
        {/* dashed oval */}
        <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke={line} strokeWidth={1.2} strokeDasharray={[5, 6]} fill="none" />
        {/* accent corner ticks */}
        <Path
          d={`M${l} ${t + tick}V${t}H${l + tick} M${r - tick} ${t}H${r}V${t + tick} M${r} ${b - tick}V${b}H${r - tick} M${l + tick} ${b}H${l}V${b - tick}`}
          stroke={colors.accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="square"
        />
      </Svg>
    </View>
  );
}
