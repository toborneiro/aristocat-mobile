import { useIsFocused } from '@react-navigation/native';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { motion } from '../theme/tokens';

export function useChartReveal() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const isFocused = useIsFocused();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    if (!isFocused || reduceMotion) {
      progress.setValue(1);
      return;
    }

    progress.setValue(0);
    const animation = Animated.timing(progress, {
      duration: motion.chartRevealDuration,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });
    animation.start();

    return () => animation.stop();
  }, [isFocused, progress, reduceMotion]);

  return progress;
}
