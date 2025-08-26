import React from 'react';
import { View, Dimensions } from 'react-native';
import { Platform } from 'react-native';
import { Text } from '@/components/ui/text';

// Conditional imports based on platform
const VictoryComponents = Platform.select({
  web: () => require('victory'),
  default: () => require('victory-native'),
})();

const { VictoryLine, VictoryChart, VictoryAxis, VictoryArea } = VictoryComponents;

interface LineChartProps {
  data: { x: number; y: number }[];
  title?: string;
  color?: string;
  gradient?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export function LineChart({ 
  data, 
  title = 'Chart', 
  color = '#007AFF',
  gradient = true 
}: LineChartProps) {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      {title && (
        <Text className="text-lg font-semibold text-gray-800 mb-4">{title}</Text>
      )}
      <VictoryChart
        width={screenWidth - 64}
        height={200}
        padding={{ left: 50, top: 20, right: 20, bottom: 50 }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            grid: { stroke: '#f0f0f0', strokeWidth: 1 },
            tickLabels: { fontSize: 12, fill: '#666' }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            grid: { stroke: 'transparent' },
            tickLabels: { fontSize: 12, fill: '#666' }
          }}
        />
        {gradient && (
          <VictoryArea
            data={data}
            style={{
              data: {
                fill: color,
                fillOpacity: 0.1,
                stroke: 'transparent'
              }
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
          />
        )}
        <VictoryLine
          data={data}
          style={{
            data: { 
              stroke: color, 
              strokeWidth: 3,
              strokeLinecap: 'round'
            }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>
    </View>
  );
}