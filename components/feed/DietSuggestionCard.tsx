import { DietSuggestion } from "@/types";
import React from "react";
import { View } from "react-native";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export default function DietSuggestionCard({
  dietSuggestion,
}: {
  dietSuggestion: DietSuggestion;
}) {
  const emoji = dietSuggestion.ingredients[0]?.emoji;
  return (
    <Card className="flex-row p-4 gap-4">
        {emoji && <Text className="!text-3xl">{emoji}</Text>}
        <View className="flex-1 gap-2">
          <Text>{dietSuggestion.description}</Text>
          <Button variant='outline'>
            <Text>Accept</Text>
          </Button>
        </View>
    </Card>
  );
}
