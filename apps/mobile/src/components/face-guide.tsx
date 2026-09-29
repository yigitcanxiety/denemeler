import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors } from '@/theme';

/**
 * Oval face-framing guide. As an overlay it dims everything outside the oval using a very thick
 * border on an oval-shaped view (no SVG dependency).
 */
export function FaceGuide({ overlay, width, height }: { overlay?: boolean; width?: number; height?: number }) {
  const window = useWindowDimensions();
  const ovalW = width ?? Math.min(window.width * 0.68, 300);
  const ovalH = height ?? ovalW * 1.32;

  if (!overlay) {
    return <View style={[styles.oval, { width: ovalW, height: ovalH, borderRadius: ovalW / 2 }]} />;
  }

  const spread = Math.max(window.width, window.height);
  return (
    <View style={styles.center}>
      <View
        style={{
          width: ovalW + spread * 2,
          height: ovalH + spread * 2,
          borderRadius: (ovalW + spread * 2) / 2,
          borderWidth: spread,
          borderColor: 'rgba(43,33,36,0.45)',
          transform: [{ scaleY: ovalH / ovalW }],
        }}
      />
      <View
        style={[
          styles.oval,
          styles.overlayOval,
          { width: ovalW, height: ovalH, borderRadius: ovalW / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -40 },
  oval: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  overlayOval: {
    position: 'absolute',
    borderColor: 'rgba(253,249,246,0.95)',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
});
