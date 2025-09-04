import { ScrollView, View } from "react-native";
import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import IngredientCard from "@/components/feed/IngredientCard";
import { Button } from "@/components/ui/button";
import { AddIngredientDialog } from "@/components/feed/AddIngredientDialog";
import ConfirmFeedModal from "@/components/feed/ConfirmFeedModal";
import { SuccessDialog } from "@/components/SuccessDialog";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import { mockRecipes } from "@/mocks/mockRecipes";
import { Ingredient } from "@/lib/api/endpoints/ingredients";
import { mockIngredients } from "@/mocks/mockIngredients";
import { useGetChild } from "@/hooks/useGetChild";

type Params = { child_id?: string | string[] };

export default function CustomiseMenu() {
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
  const child = useGetChild({ childId });
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
    setIngredients(
      mockIngredients.filter((i) =>
        ingredientIds.includes(i.ingredient_id.toString())
      )
    );
  }

  function handleConfirm() {
    setIsConfirming(true);
  }

  function handleFinalConfirm() {
    setIsConfirming(false);
    setHasConfirmed(true);
  }


    function handleSelectAlternative(oldIngredientId: number, newIngredientId: number) {
      const newIngredient = mockIngredients.find((i) => i.ingredient_id === newIngredientId);
      if (newIngredient) {
        setIngredients((prev: Ingredient[]) =>
          prev.map((ing: Ingredient) =>
            ing.ingredient_id === oldIngredientId
              ? newIngredient
              : ing
          )
        );
      }
    }

  return (
    <>
      <PageHead
        title={`Custom Meal for ${child?.name}`}
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
                {ingredients.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.ingredient_id}
                    ingredient={ingredient}
                    grams={0}
                    onSelectAlternative={(newIngredientId) =>
                      handleSelectAlternative(ingredient.ingredient_id, newIngredientId.ingredient_id)
                    }
                    onChangeAmount={function (
                      ingredientId: number,
                      amount: number
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                ))}
              </View>
              <AddIngredientDialog
                open={isAddingIngredients}
                onOpenChange={setIsAddingIngredients}
                onAddIngredientIds={handleAddIngredientIds}
                addedIngredientIds={ingredients.map((i) =>
                  i.ingredient_id.toString()
                )}
              />
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
