import { View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import AddIngredientCard from "./AddIngredientCard";
import { Button } from "../ui/button";
import {uniq} from 'lodash'
import { mockIngredients } from "@/mocks/mockIngredients";
import { Ingredient } from "@/lib/api/endpoints/ingredients";

type AddIngredientFormProps = {
  onAddIngredientIds: (ingredientIds: string[]) => void;
  addedIngredientIds: string[];
};

export default function AddIngredientForm({
  onAddIngredientIds,
  addedIngredientIds,
}: AddIngredientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const allIngredients = mockIngredients;

  const filteredIngredients = allIngredients.filter((ing) =>
    ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newIngredientIds, setNewIngredientIds] = React.useState<string[]>(addedIngredientIds);

  function handleToggleIngredient(ingredient: Ingredient) {
    if (newIngredientIds.includes(ingredient.ingredient_id.toString())) {
      setNewIngredientIds(newIngredientIds.filter(id => id !== ingredient.ingredient_id.toString()));
    } else {
      setNewIngredientIds([...newIngredientIds, ingredient.ingredient_id.toString()]);
    }
  }

  function handleConfirm() {
    onAddIngredientIds(newIngredientIds);
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
            isChecked={newIngredientIds.includes(ingredient.ingredient_id.toString())}
          />
        ))}
      </View>
      <Button className="mt-4" onPress={handleConfirm}>
        <Text>Save</Text>
      </Button>
    </View>
  );
}
