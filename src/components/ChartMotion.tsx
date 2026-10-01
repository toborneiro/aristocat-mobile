import { Animated, StyleSheet, View } from 'react-native';

import { radius } from '../theme/tokens';

type Point = { x: number; y: number };

export function AnimatedChartSegment({
  color,
  end,
  order,
  progress,
  start,
  strokeWidth,
  total,
}: {
  color: string;
  end: Point;
  order: number;
  progress: Animated.Value;
  start: Point;
  strokeWidth: number;
  total: number;
}) {
  const horizontal = end.x - start.x;
  const vertical = end.y - start.y;
  const length = Math.sqrt(horizontal * horizontal + vertical * vertical);
  const angle = (Math.atan2(vertical, horizontal) * 180) / Math.PI;
  const reveal = progress.interpolate({
    inputRange: [0, (order + 1) / total, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <View
      style={[
        styles.segment,
        {
          height: strokeWidth,
          left: start.x,
          top: start.y,
          transform: [{ rotate: `${angle}deg` }],
          width: length,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.segmentStroke,
          { backgroundColor: color, opacity: reveal, transform: [{ scaleX: reveal }] },
        ]}
      />
    </View>
  );
}

export function AnimatedChartDot({
  color,
  order,
  point,
  progress,
  size,
  total,
}: {
  color: string;
  order: number;
  point: Point;
  progress: Animated.Value;
  size: number;
  total: number;
}) {
  const reveal = progress.interpolate({
    inputRange: [0, (order + 1) / total, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          height: size,
          left: point.x - size / 2,
          opacity: reveal,
          top: point.y - size / 2,
          transform: [{ scale: reveal }],
          width: size,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  segment: { overflow: 'hidden', position: 'absolute', transformOrigin: 'left center' },
  segmentStroke: { flex: 1, transformOrigin: 'left center' },
  dot: { borderRadius: radius.pill, pointerEvents: 'none', position: 'absolute' },
});
