import { View, useWindowDimensions } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Text } from "../ui/text";
import NutritionRings from "../diets/NutritionRings";
import { getMealsByChildInRange, Meal } from "@/lib/api/endpoints/meals";
import moment from "moment";
import { Intakes } from "@/types";

type WeeklyIntakeSectionProps = {
  childId: string;
  target: Intakes;
};

export default function WeeklyIntakeSection({
  childId,
  target,
}: WeeklyIntakeSectionProps) {
  const { width } = useWindowDimensions(); // 👈 listen to screen width changes

  const today = new Date();
  const dayOfWeek = today.getDay();

  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (childId) {
      const endOfToday = new Date();
      endOfToday.setUTCHours(23, 59, 59, 999);

      const startOfWeek = moment().startOf("week").toDate();
      startOfWeek.setUTCHours(0, 0, 0, 0);

      getMealsByChildInRange?.(Number(childId), {
        start: startOfWeek.toISOString(),
        end: endOfToday.toISOString(),
      }).then((res) => {
        if (res) {
          setMeals(res);
        }
      });
    }
  }, [childId]);

  const mealsByDay = useMemo(() => {
    const grouped: Record<string, Meal[]> = {};
    meals.forEach((meal) => {
      const day = moment(meal.created_at).format("YYYY-MM-DD");
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(meal);
    });
    return grouped;
  }, [meals]);

  const totalIntakesByDay = useMemo(() => {
    const totals: Record<
      string,
      {
        vegetable: number;
        protein: number;
        fruit: number;
        grain: number;
        dairy: number;
      }
    > = {};
    Object.entries(mealsByDay).forEach(([day, dayMeals]) => {
      totals[day] = {
        vegetable: 0,
        protein: 0,
        fruit: 0,
        grain: 0,
        dairy: 0,
      };
      dayMeals.forEach((meal) => {
        totals[day].vegetable += meal.servings_veg_legumes_beans || 0;
        totals[day].protein += meal.servings_meat_fish_eggs_nuts_seeds || 0;
        totals[day].fruit += meal.servings_fruit || 0;
        totals[day].grain += meal.servings_grain || 0;
        totals[day].dairy += meal.servings_milk_yoghurt_cheese || 0;
      });
    });
    return totals;
  }, [mealsByDay]);

  // Calculate Monday of the current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  // Always generate full week (7 days)
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }

  const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Dynamically adjust ring size
  // Responsive breakpoints: mobile (<480), tablet (<900), desktop (>=900)
  let ringSize, ringGap, ringThickness;
  if (width < 480) {
    // Mobile
    ringSize = 36;
    ringGap = 0;
    ringThickness = 4;
  } else if (width < 900) {
    // Tablet
    ringSize = 60;
    ringGap = 6;
    ringThickness = 6;
  } else {
    // Desktop
    ringSize = 120;
    ringGap = 6;
    ringThickness = 6;
  }

  return (
    <View className="my-4 grid grid-cols-7 justify-between items-center">
      {dates.map((date, idx) => {
        const isFuture = date > today;
        const totalIntake = totalIntakesByDay[
          date.toISOString().split("T")[0]
        ] || {
          vegetable: 0,
          protein: 0,
          fruit: 0,
          grain: 0,
          dairy: 0,
        };
        return (
          <View key={dayLabels[idx]} className="items-center">
            {date.getDay()}
            <NutritionRings
              size={ringSize}
              gap={ringGap}
              thickness={ringThickness}
              disabled={isFuture}
              values={
                isFuture
                  ? { vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 }
                  : totalIntake
              }
              target={
                isFuture
                  ? { vegetable: 1, protein: 1, fruit: 1, grain: 1, dairy: 1 }
                  : target
              }
            />
            <Text className="text-amber-400">{dayLabels[idx]}</Text>
          </View>
        );
      })}
    </View>
  );
}
