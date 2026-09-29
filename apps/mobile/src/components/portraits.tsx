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
} as const;

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
