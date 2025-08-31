import { View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { MenuIngredient } from "@/types";
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

type IngredientCardProps = {
  ingredient: MenuIngredient;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const [amount, setAmount] = React.useState(ingredient.amount);
  const [selectedUnit, setSelectedUnit] = React.useState(ingredient.units[0]);
  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-lg">{ingredient.emoji}</Text>
          <Text>{ingredient.name}</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <Input
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
          />
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
                {ingredient.units.map((unit) => (
                  <SelectItem key={unit} label={unit} value={unit} />
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>
      <View className="grid grid-cols-2 gap-2">
        <Button>
          <XIcon className="text-white" />
          <Text>Skip</Text>
        </Button>
        <Button>
          <ArrowLeftRight className="text-white" />
          <Text>Find Alternative</Text>
        </Button>
      </View>
    </Card>
  );
}
