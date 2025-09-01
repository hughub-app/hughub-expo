import { View } from "react-native";
import React from "react";
import { Input } from "../ui/input";
import AddIngredientCard from "./AddIngredientCard";
import { mockIngredients } from "@/mocks/mockIngredients";
import { Ingredient } from "@/lib/api/endpoints/ingredients";

type SwitchIngredientFormProps = {
  onSelectIngredient?: (ingredientId: number) => void;
  ingredientId: number;
};

export default function SwitchIngredientForm({
  onSelectIngredient,
  ingredientId
}: SwitchIngredientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const allIngredients = mockIngredients;

  const oldIngredient = allIngredients.find((ing) => ing.ingredient_id === ingredientId);

  const filteredIngredients = allIngredients.filter((ing) =>
    ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) && ing.category === oldIngredient?.category
  ).slice(0, 9);

  function handleToggleIngredient(ingredient: Ingredient) {
    onSelectIngredient?.(ingredient.ingredient_id)
  }

  return (
    <View>
      <Input
        placeholder="Search ingredient"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View className="grid grid-cols-3 gap-2 mt-4">
        {filteredIngredients.map((ingredient) => (
          <AddIngredientCard
            ingredient={ingredient}
            onPress={handleToggleIngredient}
            isChecked={ingredient.ingredient_id === ingredientId}
          />
        ))}
      </View>
    </View>
  );
}
