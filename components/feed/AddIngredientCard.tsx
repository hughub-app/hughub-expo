import React from "react";
import { Text } from "../ui/text";
import { Card } from "../ui/card";
import { Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react-native";
import { Ingredient } from "@/lib/api/endpoints/ingredients";

type AddIngredientCardProps = {
  ingredient: Ingredient;
  onPress: (ingredient: Ingredient) => void;
  isChecked: boolean;
};

export default function AddIngredientCard({
  ingredient,
  onPress,
  isChecked,
}: AddIngredientCardProps) {
  return (
    <Pressable onPress={() => onPress(ingredient)}>
      <Card
        className={cn(
          "relative items-center p-4 h-full justify-center",
          isChecked && "border-2 border-blue-500"
        )}
      >
        {isChecked && <CheckCircle className="text-blue-500 absolute top-2 right-2" size={16} />}
        <Text className="text-2xl">{ingredient.emoji}</Text>
        <Text className="text-center">{ingredient.ingredient_name}</Text>
      </Card>
    </Pressable>
  );
}
