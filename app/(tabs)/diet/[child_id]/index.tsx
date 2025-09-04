import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import { getMealsByChildInRange, Meal } from "@/lib/api/endpoints/meals";
import moment from "moment";
import { DietaryGuideline, listDietaryGuidelines } from "@/lib/api/endpoints/dietaryGuidelines";
import { getAge } from "@/lib/utils";
import { Intakes } from "@/types";

type Params = { child_id?: string | string[] };

export default function DietByChildPage() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const [meals, setMeals] = useState<Meal[]>([]);

  const todaysMeals = meals.filter((meal) => {
    if (!meal.created_at) return false;
    const mealDate = new Date(meal.created_at);
    const today = new Date();
    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  });

  const todaysIntake: Intakes = todaysMeals.reduce(
    (acc, meal) => {
      acc.vegetable += meal.servings_veg_legumes_beans || 0;
      acc.protein += meal.servings_meat_fish_eggs_nuts_seeds || 0;
      acc.fruit += meal.servings_fruit || 0;
      acc.grain += meal.servings_grain || 0;
      acc.dairy += meal.servings_milk_yoghurt_cheese || 0;
      return acc;
    },
    { vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 }
  );

  // Force param into a single string
  const childId = useMemo(() => {
    const v = params.child_id;
    return Array.isArray(v) ? v[0] : v;
  }, [params.child_id]);

  const child = mockChildren.find((c) => c.child_id === Number(childId));
  const age = getAge(child?.date_of_birth ? new Date(child.date_of_birth) : new Date());

  const endOfToday = useMemo(() => moment().endOf("day").toDate(), []);
  const startOfDay = useMemo(() => moment().startOf("day").toDate(), []);

  useEffect(() => {
    if (childId) {
      getMealsByChildInRange?.(Number(childId), {
        start: startOfDay.toISOString(),
        end: endOfToday.toISOString(),
      }).then((res) => {
        if (res) {
          setMeals(res);
        }
      });
    }
  }, [childId, endOfToday, startOfDay]);

  const [guidelines, setGuidelines] = useState<DietaryGuideline[]>([]);
  const guide = guidelines?.[0];
  const target: Intakes = {
    vegetable: guide?.servings_veg_legumes_beans || 0,
    protein: guide?.servings_meat_fish_eggs_nuts_seeds || 0,
    fruit: guide?.servings_fruit || 0,
    grain: guide?.servings_grain || 0,
    dairy: guide?.servings_milk_yoghurt_cheese || 0,
  };

  useEffect(() => {
    if (child && child.gender) {
      listDietaryGuidelines({
        age,
        gender: child.gender,
      }).then((res) => {
        if (res) {
          setGuidelines(res);
        }
      })
      // Do something with the child data
    }
  }, [child]);

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

  const lastMeal = meals.sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
  )[0];

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
                  values={todaysIntake}
                  target={target}
                />
                <NutritionLabels />
              </View>
              <WeeklyIntakeSection childId={childId} target={target} />
              {/* Replace with your real UI (FlatList of meals, etc.) */}
              {lastMeal && (
                <>
                  <Text className="!text-2xl font-bold">Last Meal</Text>
                  <View className="rounded-2xl border border-neutral-200 p-4">
                    <Text className="text-lg font-semibold">
                      {lastMeal.meal_name}
                    </Text>
                    <NutritionLabels
                      values={{
                        vegetable: lastMeal.servings_veg_legumes_beans || 0,
                        protein:
                          lastMeal.servings_meat_fish_eggs_nuts_seeds || 0,
                        fruit: lastMeal.servings_fruit || 0,
                        grain: lastMeal.servings_grain || 0,
                        dairy: lastMeal.servings_milk_yoghurt_cheese || 0,
                      }}
                    />
                    <Text className="mt-2 text-sm text-gray-500">
                      Cooked on: 2024-06-20
                    </Text>
                  </View>
                </>
              )}
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
