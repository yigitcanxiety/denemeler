import type { LookId } from '@tonelle/shared';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageProps,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

/**
 * Editorial portraits (DESIGN.md §5): the founder-approved AI portraits. They can be swapped
 * for new files under the same names without code changes.
 */
export const PORTRAITS = {
  hero: require('../../assets/images/portrait-hero.jpg') as ImageSourcePropType,
  two: require('../../assets/images/portrait-2.jpg') as ImageSourcePropType,
  three: require('../../assets/images/portrait-3.jpg') as ImageSourcePropType,
  // Deep, light-cool and olive skin tones, so every season is represented (Gemini, 2026-10-15).
  four: require('../../assets/images/portrait-four.jpg') as ImageSourcePropType,
  five: require('../../assets/images/portrait-five.jpg') as ImageSourcePropType,
  six: require('../../assets/images/portrait-six.jpg') as ImageSourcePropType,
} as const;

/** Example of each makeup look, on eight different women (Google Flow, Nano Banana 2.1, 2026-10-25). */
export const LOOK_IMAGES: Record<LookId, ImageSourcePropType> = {
  natural_glow: require('../../assets/images/looks/natural_glow.jpg'),
  office_chic: require('../../assets/images/looks/office_chic.jpg'),
  soft_glam: require('../../assets/images/looks/soft_glam.jpg'),
  evening_smoky: require('../../assets/images/looks/evening_smoky.jpg'),
  bridal: require('../../assets/images/looks/bridal.jpg'),
  bold_lip: require('../../assets/images/looks/bold_lip.jpg'),
  no_makeup_makeup: require('../../assets/images/looks/no_makeup_makeup.jpg'),
  festival_color: require('../../assets/images/looks/festival_color.jpg'),
};

/**
 * `cover` image with a vertical focus point (RN's Image has no object-position). `focusY` 0 keeps
 * the top edge, 0.5 centres; portraits keep faces in the upper third, so 0.2–0.3 works well.
 */
export function CoverImage({
  source,
  focusY = 0.25,
  style,
  imageStyle,
  ...rest
}: {
  source: ImageSourcePropType;
  focusY?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: ImageProps['style'];
} & Omit<ImageProps, 'source' | 'style'>) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const ratio = aspectOf(source);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!box || box.w !== width || box.h !== height) setBox({ w: width, h: height });
  };

  let frame: { width: number; height: number; left: number; top: number } | null = null;
  if (box && box.w > 0 && box.h > 0) {
    // Scale so the image covers the box, then shift by the focus point.
    const w = Math.max(box.w, box.h / ratio);
    const h = w * ratio;
    frame = { width: w, height: h, left: (box.w - w) / 2, top: (box.h - h) * Math.max(0, Math.min(1, focusY)) };
  }

  return (
    <View style={[styles.box, style]} onLayout={onLayout}>
      {frame ? (
        <Image
          {...rest}
          source={source}
          style={[{ position: 'absolute', ...frame }, imageStyle]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : null}
    </View>
  );
}

/** height / width of a bundled image (react-native-web has no resolveAssetSource; portraits are 3:4). */
function aspectOf(source: ImageSourcePropType): number {
  const asset = typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource(source) : source;
  const { width, height } = (asset ?? {}) as { width?: number; height?: number };
  return width && height ? height / width : 4 / 3;
}

const styles = StyleSheet.create({ box: { overflow: 'hidden' } });
