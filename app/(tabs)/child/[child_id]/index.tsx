// app/child/[child_id].tsx

import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RingChart } from "@/components/charts/RingChart";
import Emoji from "@/components/emoji";

export default function ChildScreen() {
  const { child_id } = useLocalSearchParams<{ child_id: string }>();
  const router = useRouter();

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Child ID: {child_id}
          </Text>

          {/* Emotional Wellbeing Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-5xl">Emotional Wellbeing</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Monthly Mood Overview LineChart*/}
              <LineChart
                data={mockMoodData}
                title="Monthly Mood Overview"
                color="#00D4AA"
              />

              {/* Mood Static Card */}
              <View className="flex-row space-x-6 top-6">
                {/* Weekly Average Card */}
                <Card className="flex-1 mr-2 items-center">
                  <View className="flex-row justify-center align-middle h-fit">
                    <Emoji type="laugh" />
                    <View>
                      <CardHeader>
                        <CardTitle className="text-3xl">Weekly Average</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Text className="text-lg text-gray-800">
                            Average Mood: 3.5/5
                          </Text>                    
                      </CardContent>
                    </View>
                  </View>
                </Card>
                {/* Lastest Mood */}
                <Card className="flex-1 ml-2 items-center">
                  <CardHeader>
                    <CardTitle className="text-3xl">Latest Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text className="text-lg text-gray-800">Mood: 4/5</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Recorded on: 2024-06-20
                    </Text>
                  </CardContent>
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
                onPress={
                  () => {}
                  // router.push({
                  //   pathname: '/child/view_detail',
                  //   params: { child_id },
                  // })
                }
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
                <RingChart
                    progress={0.75}
                    color="#FF8C00"
                    size={200}  
                    strokeWidth={20}
                    title="Macronutrient Distribution"
                    />  
            
              <Button
                onPress={() => {
                  // router.push({
                  //   pathname: '/child/diet_detail',
                  //   params: { child_id },
                  // })
                }}
              >
                <Text>View Diet Details</Text>
              </Button>
            </CardContent>  
            </Card>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

