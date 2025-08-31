import { ScrollView, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
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
import ConfirmFeedModal from "@/components/feed/ConfirmFeedModal";
import { SuccessDialog } from "@/components/SuccessDialog";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import { mockRecipes } from "@/mocks/mockRecipes";
import RecipeCard from "@/components/menus/RecipeCard";

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

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    mockIngredients.slice(0, 2)
  );

  const [isAddingIngredients, setIsAddingIngredients] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  function handleAddIngredientIds(ingredientIds: string[]) {
    setIngredients([
      ...mockIngredients.filter((i) => ingredientIds.includes(i.id)),
    ]);
  }

  function handleConfirm() {
    setIsConfirming(true);
  }

  function handleFinalConfirm() {
    setIsConfirming(false);
    setHasConfirmed(true);
  }

  const allRecipes = mockRecipes;
  const recipes = allRecipes;

  return (
    <>
      <PageHead
        title={`Log Meal for ${child?.name}`}
        description={`Time to feed ${child?.name}`}
      />
      <SuccessDialog
        open={hasConfirmed}
        onOpenChange={setHasConfirmed}
        title="Awesome!"
        description={`${child.name} has been fed!`}
        buttonText="Yay!"
        onConfirm={() => {
          router.replace(`/(tabs)/diet/${child.child_id}`);
        }}
      />
      <ConfirmFeedModal
        child={child}
        visible={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleFinalConfirm}
        ingredients={ingredients}
        childIntake={child.todayIntakes}
      />
      <SafeAreaView className="flex-1">
        <ScrollView>
          <PageContainer>
            <BackButton fallbackUrl={`/(tabs)/diet/${child.child_id}`} />
            <Text className="!text-3xl font-bold">Feed {child.name}</Text>
            <Select className="mt-4">
              <SelectTrigger className="!w-full">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Meal Type</SelectLabel>
                  <SelectItem label="Breakfast" value="breakfast" />
                  <SelectItem label="Lunch" value="lunch" />
                  <SelectItem label="Dinner" value="dinner" />
                </SelectGroup>
              </SelectContent>
            </Select>
            <View className="mt-4">
              <View className="grid md:grid-cols-2 gap-2 mb-4">
                {recipes.map((recipe) => (
                  <Link
                    href={`/(tabs)/diet/${child.child_id}/feed/recipe/${recipe.recipe_id}`}
                  >
                    <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                  </Link>
                ))}
              </View>
            </View>
            <Button className="mt-4" onPress={handleConfirm}>
              <Text>Feed the Child!</Text>
            </Button>
          </PageContainer>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
