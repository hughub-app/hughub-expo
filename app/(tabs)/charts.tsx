import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/charts/LineChart';
import { MultiRingChart } from '@/components/charts/MultiRingChart';

const weeklyStepsData = [
  { x: 1, y: 8500 },
  { x: 2, y: 12000 },
  { x: 3, y: 9500 },
  { x: 4, y: 15000 },
  { x: 5, y: 11000 },
  { x: 6, y: 13500 },
  { x: 7, y: 10500 },
];

const heartRateData = [
  { x: 1, y: 72 },
  { x: 2, y: 75 },
  { x: 3, y: 78 },
  { x: 4, y: 82 },
  { x: 5, y: 79 },
  { x: 6, y: 77 },
  { x: 7, y: 74 },
];

const sleepData = [
  { x: 1, y: 7.5 },
  { x: 2, y: 6.8 },
  { x: 3, y: 8.2 },
  { x: 4, y: 7.1 },
  { x: 5, y: 8.5 },
  { x: 6, y: 7.9 },
  { x: 7, y: 8.0 },
];

const activityRings = [
  {
    progress: 0.85,
    color: '#FF006E',
    title: 'Move',
    subtitle: '850/1000 cal'
  },
  {
    progress: 0.70,
    color: '#00D4AA',
    title: 'Exercise',
    subtitle: '21/30 min'
  },
  {
    progress: 0.58,
    color: '#007AFF',
    title: 'Stand',
    subtitle: '7/12 hrs'
  }
];

export default function ChartsScreen() {
  const [selectedChart, setSelectedChart] = useState<'steps' | 'heart' | 'sleep'>('steps');

  const getCurrentData = () => {
    switch (selectedChart) {
      case 'steps':
        return { data: weeklyStepsData, title: 'Weekly Steps', color: '#007AFF' };
      case 'heart':
        return { data: heartRateData, title: 'Heart Rate (BPM)', color: '#FF006E' };
      case 'sleep':
        return { data: sleepData, title: 'Sleep Hours', color: '#00D4AA' };
      default:
        return { data: weeklyStepsData, title: 'Weekly Steps', color: '#007AFF' };
    }
  };

  const currentChart = getCurrentData();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        {/* <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Your Charts
          </Text>
          <Text className="text-gray-600 mb-6">
            Detailed insights into your health and fitness
          </Text>

          <MultiRingChart
            rings={activityRings}
            title="Today's Activity"
          />

          <View className="mt-6 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Weekly Trends
            </Text>
            <View className="flex-row space-x-2">
              <Button
                variant={selectedChart === 'steps' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setSelectedChart('steps')}
                className="flex-1"
              >
                <Text>Steps</Text>
              </Button>
              <Button
                variant={selectedChart === 'heart' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setSelectedChart('heart')}
                className="flex-1"
              >
                <Text>Heart</Text>
              </Button>
              <Button
                variant={selectedChart === 'sleep' ? 'default' : 'outline'}
                size="sm"
                onPress={() => setSelectedChart('sleep')}
                className="flex-1"
              >
                <Text>Sleep</Text>
              </Button>
            </View>
          </View>

          <LineChart
            data={currentChart.data}
            title={currentChart.title}
            color={currentChart.color}
          />

          <View className="mt-6 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Quick Stats
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Average Steps</Text>
                <Text className="font-semibold">11,286</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Resting Heart Rate</Text>
                <Text className="font-semibold">65 BPM</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Average Sleep</Text>
                <Text className="font-semibold">7.7 hours</Text>
              </View>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}