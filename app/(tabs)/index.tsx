import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RingChart } from "@/components/charts/RingChart";
import { LineChart } from "@/components/charts/LineChart";
import { mockChildren } from "@/mocks/mockChildren";
import ChildCard from "@/components/ChildCard";
import { Link } from "expo-router";
import PageContainer from "@/components/PageContainer";

const sampleLineData = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
  { x: 6, y: 2 },
  { x: 7, y: 6 },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <PageContainer>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Health Dashboard
          </Text>
          <Text className="text-gray-600 mb-6">
            Track your progress with beautiful charts and insights
          </Text>

          <View className="gap-4">
            {mockChildren.map((child, cIdx) => (
              <Link href={`/child/${child.child_id}`} key={cIdx}>
                <ChildCard child={child} />
              </Link>
            ))}
          </View>

          {/* <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Text>Today's Summary</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-around items-center">
                <RingChart
                  progress={0.75}
                  color="#FF006E"
                  title="Move"
                  subtitle="750/1000 cal"
                  size={90}
                />
                <RingChart
                  progress={0.60}
                  color="#00D4AA"
                  title="Exercise"
                  subtitle="18/30 min"
                  size={90}
                />
                <RingChart
                  progress={0.45}
                  color="#007AFF"
                  title="Stand"
                  subtitle="9/12 hrs"
                  size={90}
                />
              </View>
            </CardContent>
          </Card>

          <LineChart
            data={sampleLineData}
            title="Weekly Steps"
            color="#007AFF"
          />

          <View className="mt-6 space-y-3">
            <Button className="w-full">
              <Text>Start Workout</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <Text>View All Data</Text>
            </Button>
          </View> */}
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
