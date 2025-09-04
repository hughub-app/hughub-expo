import React, { useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { router } from "expo-router";
import NutritionRings from "./diets/NutritionRings";
import useTodayIntake from "@/hooks/useTodayIntake";
import { Child, listChildren } from "@/lib/api/endpoints/children";
import { View } from "react-native";
import NutritionLabels from "./diets/NutritionLabels";

export default function ChildDashboardTodayIntake({
  childId,
}: {
  childId: string;
}) {
  const [child, setChild] = React.useState<Child | null>(null);

  useEffect(() => {
    listChildren({
        ids: childId
    }).then((data) => {
      if (data) {
        setChild(data?.[0] || null);
      }
    });
  }, [childId]);

  const { todaysIntake, target } = useTodayIntake({
    childId,
    dateOfBirth: child?.date_of_birth || "",
    gender: child?.gender || "M",
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <Text className="!text-4xl font-bold">Diet & Nutrition</Text>
      </CardHeader>
      <CardContent>
        <Text className="mt-4 ml-2 text-xl font-bold text-gray-800 mb-2">
          Today's Intakes
        </Text>
        <View className="flex-row justify-center gap-4 items-center mb-4">
            <NutritionRings
            values={todaysIntake}
            target={target}
            />
            <NutritionLabels/>
        </View>

        <Button
          onPress={() => {
            router.push({
              pathname: "/diet/[child_id]",
              params: { child_id: childId },
            });
          }}
        >
          <Text>View Details</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
