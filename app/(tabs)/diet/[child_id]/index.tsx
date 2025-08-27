import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator, ScrollView } from "react-native";
import React, { useMemo } from "react";
import Rings from "@/components/charts/Rings";
import { mockChildren } from "@/mocks/mockChildren";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import NutritionLabels from "@/components/diets/NutritionLabels";
import NutritionRings from "@/components/diets/NutritionRings";

type Params = { child_id?: string | string[] };

export default function DietByChildPage() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  // Force param into a single string
  const childId = useMemo(() => {
    const v = params.child_id;
    return Array.isArray(v) ? v[0] : v;
  }, [params.child_id]);

  const child = mockChildren.find((c) => c.child_id === Number(childId));

  if (!childId) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-red-500">
          Missing child_id in route.
        </Text>
      </View>
    );
  }

  // Example: validate (UUID/string) or fetch here
  // useEffect(() => { fetch(`/api/children/${childId}/diet`)... }, [childId])

  return (
    <>
      {/* <Stack.Screen
        options={{
          title: "Diet",
          headerBackTitle: "Back",
        }}
      /> */}
      <SafeAreaView>
        <ScrollView className="container mx-auto">
          <View className="flex-1 p-4 gap-4">
            <Text className="!text-3xl font-bold">{child?.name}'s Diet</Text>
            <View className="flex-row gap-6 justify-center items-center">
              <NutritionRings
                values={{
                  dairy: 2,
                  protein: 3,
                  grains: 4,
                  veggies: 5,
                  fruits: 2,
                }}
                target={{
                  dairy: 6,
                  protein: 5,
                  grains: 5,
                  veggies: 6,
                  fruits: 3,
                }}
              />
              <NutritionLabels />
            </View>
            <Text className="text-xl font-semibold">Child ID: {childId}</Text>

            {/* Replace with your real UI (FlatList of meals, etc.) */}
            <View className="rounded-2xl border border-neutral-200 p-4">
              <Text className="text-base text-neutral-700">
                TODO: Show today’s meals, nutrients, and quick actions here.
              </Text>
            </View>

            <View className="items-center justify-center py-6">
              <ActivityIndicator />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
