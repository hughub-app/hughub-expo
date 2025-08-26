import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RingChart } from '@/components/charts/RingChart';
import { LineChart } from '@/components/charts/LineChart';

const monthlyData = [
  { x: 1, y: 12000 },
  { x: 2, y: 15000 },
  { x: 3, y: 11000 },
  { x: 4, y: 18000 },
  { x: 5, y: 14000 },
  { x: 6, y: 16000 },
  { x: 7, y: 13000 },
  { x: 8, y: 17000 },
  { x: 9, y: 19000 },
  { x: 10, y: 15500 },
  { x: 11, y: 16800 },
  { x: 12, y: 20000 },
];

export default function ActivityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Activity Overview
          </Text>
          <Text className="text-gray-600 mb-6">
            Your complete fitness journey
          </Text>

          {/* Current Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Text>Current Progress</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-center">
                <RingChart
                  progress={0.68}
                  color="#FF006E"
                  title="Daily Goal"
                  subtitle="680/1000 cal"
                  size={140}
                  strokeWidth={12}
                />
              </View>
            </CardContent>
          </Card>

          {/* Monthly Overview */}
          <LineChart
            data={monthlyData}
            title="Monthly Steps Overview"
            color="#00D4AA"
          />

          {/* Achievement Cards */}
          <View className="mt-6 space-y-4">
            <Card>
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      7-Day Streak
                    </Text>
                    <Text className="text-gray-600">Keep it up!</Text>
                  </View>
                  <View className="bg-green-100 rounded-full p-3">
                    <Text className="text-2xl">🔥</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      Personal Best
                    </Text>
                    <Text className="text-gray-600">20,000 steps in a day</Text>
                  </View>
                  <View className="bg-blue-100 rounded-full p-3">
                    <Text className="text-2xl">👟</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      Workout Completed
                    </Text>
                    <Text className="text-gray-600">45 min strength training</Text>
                  </View>
                  <View className="bg-purple-100 rounded-full p-3">
                    <Text className="text-2xl">💪</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}