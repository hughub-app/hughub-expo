import {
  DietaryGuideline,
  listDietaryGuidelines,
} from "@/lib/api/endpoints/dietaryGuidelines";
import { getMealsByChildInRange, Meal } from "@/lib/api/endpoints/meals";
import { getAge } from "@/lib/utils";
import { Intakes } from "@/types";
import React, { useEffect, useState } from "react";

export default function useTodayIntake({
  childId,
  dateOfBirth,
  gender,
}: {
  childId: string;
  dateOfBirth: string;
  gender: "M" | "F";
}) {
  const [meals, setMeals] = React.useState<Meal[]>([]);
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
  const age = getAge(dateOfBirth ? new Date(dateOfBirth) : new Date());

  useEffect(() => {
    if (childId) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setUTCHours(23, 59, 59, 999);

      getMealsByChildInRange?.(Number(childId), {
        start: startOfDay.toISOString(),
        end: endOfToday.toISOString(),
      }).then((res) => {
        if (res) {
          setMeals(res);
        }
      });
    }
  }, [childId]);

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
    if (age && gender) {
      listDietaryGuidelines({
        age,
        gender,
      }).then((res) => {
        if (res) {
          setGuidelines(res);
        }
      });
    }
  }, [age]);

  return {
    meals,
    target,
    guidelines,
    guideline: guide,
    todaysIntake
  };
}
