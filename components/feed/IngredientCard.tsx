import { View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeftRight, XIcon } from "lucide-react-native";
import { Ingredient } from "@/lib/api/endpoints/ingredients";

type IngredientCardProps = {
  ingredient: Ingredient;
  grams: number;
  units?: string[];
  onSkip?: (ingredientId: number) => void;
  onFindAlternative?: (ingredientId: number) => void;
  onChangeAmount: (ingredientId: number, amount: number) => void;
};

export default function IngredientCard({ ingredient, grams, units, onSkip, onFindAlternative, onChangeAmount }: IngredientCardProps) {
  const [amount, setAmount] = React.useState((grams || 0).toString());
  const [selectedUnit, setSelectedUnit] = React.useState(units?.[0] || 'grams');
  function handleChangeAmount(amount: string) {
    setAmount(amount);
    onChangeAmount(ingredient.ingredient_id, Number(amount));
  }
  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2 mb-2">
          {/* <Text className="text-lg">{ingredient.emoji}</Text> */}
          <Text>{ingredient.ingredient_name}</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <Input
            onChangeText={handleChangeAmount}
            value={amount.toString() || '0'}
            keyboardType="numeric"
          />
          {
            !units ? (
              <Text>g</Text>
            ) : (
              <Select value={{
                label: selectedUnit,
                value: selectedUnit
              }} onValueChange={(v) => v?.value && setSelectedUnit(v?.value)}>
                <SelectTrigger className="!w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Unit</SelectLabel>
                    {units.map((unit) => (
                      <SelectItem key={unit} label={unit} value={unit} />
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          }
        </View>
      </View>
      <View className="grid grid-cols-2 gap-2">
        <Button onPress={() => onSkip(ingredient.ingredient_id)}>
          <XIcon className="text-white" />
          <Text>Skip</Text>
        </Button>
        <Button onPress={() => onFindAlternative(ingredient.ingredient_id)}>
          <ArrowLeftRight className="text-white" />
          <Text>Find Alternative</Text>
        </Button>
      </View>
    </Card>
  );
}
