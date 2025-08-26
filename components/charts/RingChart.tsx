import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { G, Circle } from 'react-native-svg';
import { Text } from '@/components/ui/text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingChartProps {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  startAngleDeg?: number; // default -90 to start at 12 o'clock
}

export function RingChart({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#FF006E',
  backgroundColor = '#F0F0F0',
  title,
  subtitle,
  startAngleDeg = -90,
}: RingChartProps) {
  const animatedProgress = useSharedValue(0);

  // useMemo so worklet reads stable numbers
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const aProps = useAnimatedProps(() => {
    // show a cap at 0..1 just in case
    const clamped = Math.min(1, Math.max(0, animatedProgress.value));
    return {
      strokeDashoffset: circumference * (1 - clamped),
    };
  });

  return (
    <View className="items-center">
      <View className="relative items-center justify-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Rotate the whole group to start at 12 o’clock */}
          <G originX={size / 2} originY={size / 2} rotation={startAngleDeg}>
            {/* Track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              // IMPORTANT: array, not a single number
              strokeDasharray={[circumference, circumference]}
              // IMPORTANT: pass via animatedProps (don’t spread)
              animatedProps={aProps}
            />
          </G>
        </Svg>

        {/* Center content */}
        <View className="absolute items-center justify-center" style={{ inset: 0 }}>
          <Text className="text-2xl font-bold text-gray-800">
            {Math.round(progress * 100)}%
          </Text>
          {subtitle ? (
            <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {title ? (
        <Text className="text-sm font-medium text-gray-700 mt-3 text-center">
          {title}
        </Text>
      ) : null}
    </View>
  );
}