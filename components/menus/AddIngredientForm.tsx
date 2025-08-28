import { View } from "react-native";
import React from "react";
import { Ingredient } from "@/types";
import { mockIngredients } from "@/mocks/mockIngredients";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import AddIngredientCard from "./AddIngredientCard";
import { Button } from "../ui/button";

type AddIngredientFormProps = {
  onAddIngredients: (ingredient: Ingredient[]) => void;
  addedIngredientIds: string[];
};

export default function AddIngredientForm({
  onAddIngredients,
  addedIngredientIds,
}: AddIngredientFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const allIngredients = mockIngredients;

  const filteredIngredients = allIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newIngredients, setNewIngredients] = React.useState<Ingredient[]>([]);

  function handleToggleIngredient(ingredient: Ingredient) {
    if (newIngredients.find((ni) => ni.id === ingredient.id)) {
      setNewIngredients(newIngredients.filter((ni) => ni.id !== ingredient.id));
    } else {
      setNewIngredients([...newIngredients, ingredient]);
    }
  }

  function handleConfirm() {
    onAddIngredients(newIngredients);
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
            isChecked={[
              ...newIngredients.map((ni) => ni.id),
              ...addedIngredientIds,
            ].includes(ingredient.id)}
          />
        ))}
      </View>
      <Button className="mt-4" onPress={handleConfirm}>
        <Text>Save</Text>
      </Button>
    </View>
  );
}
