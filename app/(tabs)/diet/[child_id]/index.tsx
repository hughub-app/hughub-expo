import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator, ScrollView } from "react-native";
import React, { useMemo } from "react";
import Rings from "@/components/charts/Rings";
import { mockChildren } from "@/mocks/mockChildren";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import NutritionLabels from "@/components/diets/NutritionLabels";
import NutritionRings from "@/components/diets/NutritionRings";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import WeeklyIntakeSection from "@/components/feed/WeeklyIntakeSection";
import { mockIngredients } from "@/mocks/mockIngredients";
import { mockRecipes } from "@/mocks/mockRecipes";

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

  const lastMeal = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];

  return (
    <>
      {/* <Stack.Screen
        options={{
          title: "Diet",
          headerBackTitle: "Back",
        }}
      /> */}
      <PageHead
        title={`${child?.name}'s Diet`}
        description={`${child?.name}'s Diet`}
      />
      <SafeAreaView className="flex-1">
        <ScrollView>
          <PageContainer>
            <BackButton fallbackUrl={`/(tabs)/child/${childId}`} />
            <View className="flex-1 p-4 gap-4">
              <Text className="!text-3xl font-bold">{child?.name}'s Diet</Text>
              <View className="flex-row gap-6 justify-center items-center">
                <NutritionRings
                  values={
                    child?.todayIntakes || {
                      vegetable: 0,
                      protein: 0,
                      fruit: 0,
                      grain: 0,
                      dairy: 0,
                    }
                  }
                  target={{
                    dairy: 6,
                    protein: 5,
                    grain: 5,
                    vegetable: 6,
                    fruit: 3,
                  }}
                />
                <NutritionLabels />
              </View>
              <WeeklyIntakeSection childId={childId} />
              {/* Replace with your real UI (FlatList of meals, etc.) */}
              {
                lastMeal && (
                  <>
                    <Text className="!text-2xl font-bold">Last Meal</Text>
                    <View className="rounded-2xl border border-neutral-200 p-4">
                      <Text className="text-lg font-semibold">{lastMeal.recipe_name}</Text>
                      <NutritionLabels values={{
                        vegetable: lastMeal.servings_veg_legumes_beans || 0,
                        protein: lastMeal.servings_meat_fish_eggs_nuts_seeds || 0,
                        fruit: lastMeal.servings_fruit || 0,
                        grain: lastMeal.servings_grain || 0,
                        dairy: lastMeal.servings_milk_yoghurt_cheese || 0,
                      }} />
                      <Text className="mt-2 text-sm text-gray-500">Cooked on: 2024-06-20</Text>
                    </View>
                  </>
                )
              }
              <Link href={`/diet/${childId}/feed`} asChild>
                <Button>
                  <Text>Feed</Text>
                </Button>
              </Link>
            </View>
          </PageContainer>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
