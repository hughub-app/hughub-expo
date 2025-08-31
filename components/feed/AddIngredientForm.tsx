import { View } from "react-native";
import React from "react";
import { MenuIngredient } from "@/types";
import { mockMenuIngredients } from "@/mocks/mockMenuIngredients";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import AddIngredientCard from "./AddIngredientCard";
import { Button } from "../ui/button";
import {uniq} from 'lodash'

type AddIngredientFormProps = {
  onAddIngredientIds: (ingredientIds: string[]) => void;
  addedIngredientIds: string[];
};

export default function AddIngredientForm({
  onAddIngredientIds,
  addedIngredientIds,
}: AddIngredientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const allIngredients = mockMenuIngredients;

  const filteredIngredients = allIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newIngredientIds, setNewIngredientIds] = React.useState<string[]>(addedIngredientIds);

  function handleToggleIngredient(ingredient: MenuIngredient) {
    if (newIngredientIds.includes(ingredient.id)) {
      setNewIngredientIds(newIngredientIds.filter(id => id !== ingredient.id));
    } else {
      setNewIngredientIds([...newIngredientIds, ingredient.id]);
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
            isChecked={newIngredientIds.includes(ingredient.id)}
          />
        ))}
      </View>
      <Button className="mt-4" onPress={handleConfirm}>
        <Text>Save</Text>
      </Button>
    </View>
  );
}
