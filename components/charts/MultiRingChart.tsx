import React from 'react';
import { View } from 'react-native';
import { RingChart } from './RingChart';
import { Text } from '@/components/ui/text';

interface RingData {
  progress: number;
  color: string;
  title: string;
  subtitle?: string;
}

interface MultiRingChartProps {
  rings: RingData[];
  title?: string;
}

export function MultiRingChart({ rings, title }: MultiRingChartProps) {
  return (
    <View className="bg-white rounded-xl p-6 shadow-sm">
      {title && (
        <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {title}
        </Text>
      )}
      <View className="flex-row justify-around items-center flex-wrap">
        {rings.map((ring, index) => (
          <View key={index} className="items-center mb-4">
            <RingChart
              progress={ring.progress}
              color={ring.color}
              title={ring.title}
              subtitle={ring.subtitle}
              size={100}
              strokeWidth={6}
            />
          </View>
        ))}
      </View>
    </View>
  );
}