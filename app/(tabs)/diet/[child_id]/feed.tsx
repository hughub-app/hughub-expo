import { ScrollView, View } from "react-native";
import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockChildren } from "@/mocks/mockChildren";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { mockIngredients } from "@/mocks/mockIngredients";
import IngredientCard from "@/components/feed/IngredientCard";
import { Ingredient } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react-native";
import { AddIngredientDialog } from "@/components/feed/AddIngredientDialog";

type Params = { child_id?: string | string[] };

export default function Feed() {
  const params = useLocalSearchParams<Params>();

  // Force param into a single string
  const childId = useMemo(() => {
    const v = params.child_id;
    return Array.isArray(v) ? v[0] : v;
  }, [params.child_id]);

  if (!childId) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-red-500">
          Missing child_id in route.
        </Text>
      </View>
    );
  }

  const child = mockChildren.find((c) => c.child_id === Number(childId));

  if (!child) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-red-500">Child not found.</Text>
      </View>
    );
  }

  const [ingredients, setIngredients] = React.useState<Ingredient[]>(mockIngredients.slice(0, 2));

  const allIngredients = mockIngredients;

  const [isAddingIngredients, setIsAddingIngredients] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="container mx-auto p-4">
        <Text className="!text-3xl font-bold">Feed {child.name}</Text>
        <Select className="mt-4">
          <SelectTrigger className="!w-full">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Meal Type</SelectLabel>
              <SelectItem label="Breakfast" value="breakfast"/>
              <SelectItem label="Lunch" value="lunch"/>
              <SelectItem label="Dinner" value="dinner"/>
            </SelectGroup>
          </SelectContent>
        </Select>
        <View className="mt-4 gap-2">
          {
            ingredients.map((ingredient) => (
              <IngredientCard key={ingredient.name} ingredient={ingredient} />
            ))
          }
          <AddIngredientDialog
            open={isAddingIngredients}
            onOpenChange={setIsAddingIngredients}
            onAddIngredients={setIngredients}
            addedIngredientIds={ingredients.map((i) => i.id)}
          />
        </View>
        <Button className="mt-4">
          <Text>Feed the Child!</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
