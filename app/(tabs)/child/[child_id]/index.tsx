// app/child/[child_id].tsx

import React, { useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RingChart } from "@/components/charts/RingChart";
import Emoji from "@/components/emoji";
import { useMoodStore } from "@/hooks/useMoodStore";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import { usePersistChildId } from "@/lib/hooks/usePersistChildId";
import { useChildById } from "@/lib/hooks/useChildById";
import NutritionRings from "@/components/diets/NutritionRings";
import NutritionLabels from "@/components/diets/NutritionLabels";

export default function ChildScreen() {
  const params = useLocalSearchParams();
  const childIdParam = Array.isArray(params.child_id) ? params.child_id?.[0] : (params.child_id as string | undefined);
  const router = useRouter();

  // Persist provided id for later reuse across pages
  usePersistChildId(typeof childIdParam === 'string' ? childIdParam : undefined);

  const idNum = typeof childIdParam === 'string' ? Number(childIdParam) : NaN;
  const { child, loading, error } = useChildById(Number.isFinite(idNum) ? idNum : null);
  const todayIntakes = child?.todayIntakes;

  // Debug: verify the exact route param received and normalization
  useEffect(() => {
    console.log('Route child_id raw:', params.child_id, 'normalized:', childIdParam, 'numeric:', idNum);
  }, [params.child_id]);


  // mock mood data for past week
  const mockMoodData = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
    { x: 5, y: 5 },
    { x: 6, y: 4 },
    { x: 7, y: 3 },
  ];

  const currentEmoji = useMoodStore((s) => s.currentEmoji);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && !child) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Child not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <PageHead title={`${child?.name}`} description={`${child?.name}`} />
      <ScrollView className="flex-1 px-4">
        <PageContainer>
          <BackButton fallbackUrl="/" />

          {/* Emotional Wellbeing Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-5xl">Emotional Wellbeing</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Monthly Mood Overview LineChart*/}
              <View className="">
              <LineChart
                data={mockMoodData}
                title="Monthly Mood Overview"
                color="#00D4AA"
                height={280}
              />
              </View>

              {/* Mood Static Card */}
              <View className="flex-row space-x-6 top-6">
                {/* Weekly Average Card */}
                <Card className="flex-1 mr-2">
                  <View className="flex-row items-center p-4">
                    <View className="mr-4">
                      <Emoji type={currentEmoji} size={40} />
                    </View>
                    <View className="flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl">Weekly Average</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <Text className="text-lg text-gray-800">Average Mood: 3.5/5</Text>
                      </CardContent>
                    </View>
                  </View>
                </Card>
                {/* Lastest Mood */}
                <Card className="flex-1 ml-2">
                  <View className="flex-row items-center p-4">
                    <View className="mr-4">
                      <Emoji type={currentEmoji} size={40} />
                    </View>
                    <View className="flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl">Latest Mood</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <Text className="text-lg text-gray-800">Mood: 4/5</Text>
                        <Text className="text-sm text-gray-500 mt-1">Recorded on: 2024-06-20</Text>
                      </CardContent>
                    </View>
                  </View>
                </Card>
              </View>

              {/* Maya's Thought Tab*/}
              <Text className="text-2xl font-semibold text-gray-900 mt-8">
                Maya's Thoughts
              </Text>
              <View className="flex-row item items-center">
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900"
                >
                  Games 🎮
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900"
                >
                  Learning 📚
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900 outline-border-2"
                >
                  Friends 👫
                </Badge>
              </View>
              <Text className="text-gray-900 mt-4">
                🗓️Last Update 5 Days Ago
              </Text>

              {/* View Details Button */}
              <Button
                className="mt-4"
                onPress={() => {
                  router.push({
                    pathname: "/GetMood/[child_id]",
                    params: { child_id: String(childIdParam) },
                  });
                }}
              >
                <Text>Get Mood</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Diet & Nutrition Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-5xl">Diet & Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="mt-4 ml-2 text-xl font-bold text-gray-800 mb-2">
                Today's Intakes
              </Text>
              <View className="mt-20 order-1 md:order-2">
                <View className="flex-row justify-center gap-4 ">
                  {todayIntakes && (
                    <NutritionRings
                      values={todayIntakes}
                      target={{
                        vegetable: 6,
                        protein: 5,
                        fruit: 6,
                        grain: 4,
                        dairy: 4,
                      }}
                    />
                  )}
                  <NutritionLabels />
                </View>
              </View>

              <Button
                onPress={() => {
                  router.push({
                    pathname: "/diet/[child_id]",
                    params: { child_id: String(childIdParam) },
                  });
                }}
              >
                <Text>View Diet Details</Text>
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
