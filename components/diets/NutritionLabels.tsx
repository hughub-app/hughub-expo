import { View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { Intakes } from "@/types";

export default function NutritionLabels({ values }: {
  values?: Intakes
}) {
  return (
    <View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-green-500" />
        <Text className="font-semibold">Veggies</Text>
        {
          values?.vegetable !== undefined && (
            <Text className="ml-auto text-sm">{values.vegetable} servings</Text>
          )
        }
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-blue-500" />
        <Text className="font-semibold">Protein</Text>
        {
          values?.protein !== undefined && (
            <Text className="ml-auto text-sm">{values.protein} servings</Text>
          )
        }
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-amber-500" />
        <Text className="font-semibold">Fruits</Text>
        {
          values?.fruit !== undefined && (
            <Text className="ml-auto text-sm">{values.fruit} servings</Text>
          )
        }
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-red-500" />
        <Text className="font-semibold">Grains</Text>
        {
          values?.grain !== undefined && (
            <Text className="ml-auto text-sm">{values.grain} servings</Text>
          )
        }
      </View>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full w-4 h-4 bg-violet-500" />
        <Text className="font-semibold">Dairy</Text>
        {
          values?.dairy !== undefined && (
            <Text className="ml-auto text-sm">{values.dairy} servings</Text>
          )
        }
      </View>
    </View>
  );
}
