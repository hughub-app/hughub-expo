import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/ui/text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingChartProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
}

export function RingChart({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#FF006E',
  backgroundColor = '#F0F0F0',
  title,
  subtitle
}: RingChartProps) {
  const animatedProgress = useSharedValue(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View className="items-center">
      <View className="relative items-center justify-center">
        <Svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            {...animatedProps}
          />
        </Svg>
        
        {/* Center Content */}
        <View className="absolute items-center justify-center">
          <Text className="text-2xl font-bold text-gray-800">
            {Math.round(progress * 100)}%
          </Text>
          {subtitle && (
            <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
      
      {title && (
        <Text className="text-sm font-medium text-gray-700 mt-3 text-center">
          {title}
        </Text>
      )}
    </View>
  );
}