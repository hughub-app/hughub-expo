import { View } from "react-native";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import AddIngredientCard from "./AddIngredientCard";
import { mockIngredients } from "@/mocks/mockIngredients";
import { Ingredient, listIngredients } from "@/lib/api/endpoints/ingredients";
import HHSpinner from "../HHSpinner";

type SwitchIngredientFormProps = {
  onSelectIngredient?: (ingredient: Ingredient) => void;
  // ingredientId: number;
  oldIngredient: Ingredient;
};

export default function SwitchIngredientForm({
  onSelectIngredient,
  oldIngredient,
}: SwitchIngredientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const [loading, setIsLoading] = React.useState(false);
  const [allIngredients, setAllIngredients] = React.useState<Ingredient[]>([]);

  useEffect(() => {
    setIsLoading(true);
    listIngredients({
      category: oldIngredient?.category,
    })
      .then(setAllIngredients)
      .finally(() => setIsLoading(false));
  }, [oldIngredient]);

  const filteredIngredients = allIngredients
    .filter((ing) =>
      ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 9);

  function handleToggleIngredient(ingredient: Ingredient) {
    onSelectIngredient?.(ingredient);
  }

  return (
    <View>
      <Input
        placeholder="Search ingredient"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loading ? (
        <HHSpinner />
      ) : (
        <View className="grid grid-cols-3 gap-2 mt-4">
          {filteredIngredients.map((ingredient) => (
            <AddIngredientCard
              ingredient={ingredient}
              onPress={handleToggleIngredient}
              isChecked={
                ingredient.ingredient_id === oldIngredient.ingredient_id
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}
