import { View, useWindowDimensions } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import NutritionRings from "../diets/NutritionRings";

type WeeklyIntakeSectionProps = {
  childId: string;
};

export default function WeeklyIntakeSection({ childId }: WeeklyIntakeSectionProps) {
  const { width } = useWindowDimensions(); // 👈 listen to screen width changes

  const today = new Date();
  const dayOfWeek = today.getDay();

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
        return (
          <View key={dayLabels[idx]} className="items-center">
            <NutritionRings
              size={ringSize} // 👈 dynamic size
              gap={ringGap}
              thickness={ringThickness}
              disabled={isFuture}
              values={
                isFuture
                  ? { vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 }
                  : { vegetable: 1, protein: 0, fruit: 0, grain: 0, dairy: 0 }
              }
              target={
                isFuture
                  ? { vegetable: 1, protein: 1, fruit: 1, grain: 1, dairy: 1 }
                  : { vegetable: 2, protein: 1, fruit: 1, grain: 1, dairy: 1 }
              }
            />
            <Text className="text-amber-400">{dayLabels[idx]}</Text>
          </View>
        );
      })}
    </View>
  );
}