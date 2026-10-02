import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, TIMER_RING } from '../../constants/theme';

interface TimerRingProps {
  duration: number;
  progress: number;
  isPaused?: boolean;
  onComplete?: () => void;
  size?: number;
  strokeWidth?: number;
  warningThreshold?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Circular countdown ring: neutral track, lime fill that turns red
 * in the final {warningThreshold} seconds.
 */
export const TimerRing: React.FC<TimerRingProps> = ({
  duration,
  progress,
  isPaused,
  onComplete,
  size = TIMER_RING.size,
  strokeWidth = TIMER_RING.strokeWidth,
  warningThreshold = 10,
}) => {
  const { colors } = useTheme();

  const remaining = duration * (1 - progress);
  const isWarning = remaining <= warningThreshold && remaining > 0;

  const animatedProgress = useSharedValue(progress);
  const animatedColor = useSharedValue(colors.primary);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: isPaused ? 0 : 100 });
  }, [progress, isPaused, animatedProgress]);

  React.useEffect(() => {
    animatedColor.value = withTiming(
      isWarning ? colors.danger : colors.primary,
      { duration: 300 }
    );
  }, [isWarning, colors.primary, colors.danger, animatedColor]);

  const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
    stroke: animatedColor.value,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          stroke={colors.borderLight}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={circleProps}
        />
      </Svg>
      <View style={styles.timeContainer}>
        {/* Light grey/whiteish digits on a dark badge so the countdown
            stays highly visible in both light and dark themes. */}
        <View style={styles.timeBadge}>
          <Text
            style={[
              styles.timeText,
              { fontSize: size * 0.18, color: '#E8E8EC' },
              isWarning && { color: colors.danger },
            ]}
          >
            {formatTime(remaining)}
          </Text>
        </View>
        <Text style={[styles.labelText, { fontSize: size * 0.05, color: colors.textSecondary }]}>
          {isPaused ? 'PAUSED' : 'DISCUSSION'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: '#111114',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  timeText: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    lineHeight: undefined,
  },
  labelText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    marginTop: SPACING.xs,
    letterSpacing: 2,
  },
});
