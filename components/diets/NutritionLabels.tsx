import { View } from "react-native";
import React from "react";
import { Text } from "../ui/text";

export default function NutritionLabels() {
  return (
    <View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-300" />
        <Text className="font-semibold">Veggies</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-300" />
        <Text className="font-semibold">Protein</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-300" />
        <Text className="font-semibold">Fruits</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-300" />
        <Text className="font-semibold">Grains</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-300" />
        <Text className="font-semibold">Dairy</Text>
      </View>
    </View>
  );
}
