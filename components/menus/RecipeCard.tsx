import { Recipe } from "@/lib/api/endpoints/recipes";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";
import StackedBar from "../StackedBar";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="w-full">
      <CardContent className="!p-4">
        <Text className="font-bold text-xl mb-2">{recipe.recipe_name}</Text>
        {/* Stacked bar for recipe nutritional servings */}
        <StackedBar
          segments={[
            {
              value: recipe.servings_veg_legumes_beans || 0,
              label: "Veggies",
              colorClass: "bg-green-500",
            },
            {
              value: recipe.servings_meat_fish_eggs_nuts_seeds || 0,
              label: "Proteins",
              colorClass: "bg-blue-500",
            },
            {
              value: recipe.servings_fruit || 0,
              label: "Fruits",
              colorClass: "bg-amber-500",
            },
            {
              value: recipe.servings_grain || 0,
              label: "Grains",
              colorClass: "bg-red-500",
            },
            {
              value: recipe.servings_milk_yoghurt_cheese || 0,
              label: "Dairy",
              colorClass: "bg-violet-500",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
