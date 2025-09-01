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
import { ArrowLeftRight, Undo2, XIcon } from "lucide-react-native";
import { Ingredient } from "@/lib/api/endpoints/ingredients";
import { cn } from "@/lib/utils";
import { SwitchIngredientDialog } from "./SwitchIngredientDialog";

type IngredientCardProps = {
  ingredient: Ingredient;
  grams: number;
  units?: string[];
  onSkip?: (ingredientId: number) => void;
  onRestore?: (ingredientId: number) => void;
  onSelectAlternative: (newIngredientId: number) => void;
  onChangeAmount: (ingredientId: number, amount: number) => void;
  skipped?: boolean;
};

export default function IngredientCard({ ingredient, grams, units, onSkip, onSelectAlternative, onChangeAmount, onRestore, skipped }: IngredientCardProps) {
  const [amount, setAmount] = React.useState((grams || 0).toString());
  const [selectedUnit, setSelectedUnit] = React.useState(units?.[0] || 'grams');
  function handleChangeAmount(amount: string) {
    setAmount(amount);
    onChangeAmount(ingredient.ingredient_id, Number(amount));
  }
  return (
    <Card className={cn("p-4")}>
      <View className={cn("flex-row justify-between items-center mb-2", skipped && 'opacity-50')}>
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-lg">{ingredient.emoji}</Text>
          <Text>{ingredient.ingredient_name}</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <Input
            onChangeText={handleChangeAmount}
            value={amount.toString() || '0'}
            keyboardType="numeric"
            readOnly={skipped}
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
        <Button variant='outline' onPress={() => skipped ? onRestore?.(ingredient.ingredient_id) : onSkip?.(ingredient.ingredient_id)}>
          {
            skipped ? <Undo2 /> : <XIcon />
          }
          <Text>{skipped ? 'Restore' : 'Skip'}</Text>
        </Button>
        <SwitchIngredientDialog
          ingredient={ingredient}
          onSelectIngredient={onSelectAlternative}
        >
          <Button onPress={() => onSelectAlternative?.(ingredient.ingredient_id)} disabled={skipped}>
            <ArrowLeftRight className="text-white" />
            <Text>Find Alternative</Text>
          </Button>
        </SwitchIngredientDialog>
      </View>
    </Card>
  );
}
