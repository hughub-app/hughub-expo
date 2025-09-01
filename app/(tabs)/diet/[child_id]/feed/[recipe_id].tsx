import { View, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { mockRecipes } from "@/mocks/mockRecipes";
import PageContainer from "@/components/PageContainer";
import { Text } from "@/components/ui/text";
import BackButton from "@/components/BackButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockRecipeIngredients } from "@/mocks/mockRecipeIngredients";
import { mockIngredients } from "@/mocks/mockIngredients";
import IngredientCard from "@/components/feed/IngredientCard";
import { CategoryType, IngredientType } from "@/types";
import { capitalCase } from "change-case";
import NutritionRings from "@/components/diets/NutritionRings";
import { mockChildren } from "@/mocks/mockChildren";
import NutritionLabels from "@/components/diets/NutritionLabels";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { SuccessDialog } from "@/components/SuccessDialog";
import { Ingredient } from "@/lib/api/endpoints/ingredients";
import { PageHead } from "@/components/PageHead";

export default function RecipePage() {
  const { child_id, recipe_id } = useLocalSearchParams<{
    recipe_id: string;
    child_id: string;
  }>();

  const recipe = mockRecipes.find((r) => r.recipe_id === Number(recipe_id));
  const child = mockChildren.find((c) => c.child_id === Number(child_id));

  if (!recipe || !child) {
    return (
      <View>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  const todayIntakes = child.todayIntakes;

  const steps = recipe.cooking_steps ? recipe.cooking_steps.split("\n") : [];
  const recipeIngredients = mockRecipeIngredients.filter(
    (ri) => ri.recipe_id === recipe.recipe_id
  );
  const ingredients = mockIngredients.filter((ing) =>
    recipeIngredients.some((ri) => ri.ingredient_id === ing.ingredient_id)
  );
  const ingredientsWithGrams = ingredients.map((ing) => ({
    ingredient: ing,
    grams:
      recipeIngredients.find((ri) => ri.ingredient_id === ing.ingredient_id)
        ?.grams || 0,
    skipped: false
  }));

  const [menuIngredients, setMenuIngredients] =
    React.useState<typeof ingredientsWithGrams>(ingredientsWithGrams);

  function handleChangeAmount(ingredientId: number, amount: number) {
    setMenuIngredients((prev) =>
      prev.map((ing) =>
        ing.ingredient.ingredient_id === ingredientId
          ? { ...ing, grams: amount }
          : ing
      )
    );
  }

  const totalGramsPerIngredientType = Object.values(CategoryType).reduce(
    (acc, category) => {
      acc[category] = ingredientsWithGrams
        .filter(
          (ig) =>
            ig.ingredient.category ===
            IngredientType[
              capitalCase(
                category as unknown as keyof typeof IngredientType
              ) as keyof typeof IngredientType
            ] && !ig.skipped
        )
        .reduce((sum, ig) => sum + ig.grams, 0);
      return acc;
    },
    {} as Record<CategoryType, number>
  );

  const totalGramsPerIngredientTypeState = Object.values(CategoryType).reduce(
    (acc, category) => {
      acc[category] = menuIngredients
        .filter(
          (ig) =>
            ig.ingredient.category ===
            IngredientType[
              capitalCase(
                category as unknown as keyof typeof IngredientType
              ) as keyof typeof IngredientType
            ] && !ig.skipped
        )
        .reduce((sum, ig) => sum + ig.grams, 0);
      return acc;
    },
    {} as Record<CategoryType, number>
  );

  function calcServing(
    servings: number | undefined,
    type: CategoryType,
    totalGrams: Record<CategoryType, number>,
    stateGrams: Record<CategoryType, number>
  ): number {
    const base = servings || 0;
    const denominator = totalGrams[type];
    const ratio = denominator === 0 ? 0 : stateGrams[type] / denominator;
    const result = base * ratio;
    return isNaN(result) ? 0 : result;
  }

  const servingPerIngredientType = {
    [CategoryType.Vegetable]: calcServing(
      recipe.servings_veg_legumes_beans,
      CategoryType.Vegetable,
      totalGramsPerIngredientType,
      totalGramsPerIngredientTypeState
    ),
    [CategoryType.Protein]: calcServing(
      recipe.servings_meat_fish_eggs_nuts_seeds,
      CategoryType.Protein,
      totalGramsPerIngredientType,
      totalGramsPerIngredientTypeState
    ),
    [CategoryType.Fruit]: calcServing(
      recipe.servings_fruit,
      CategoryType.Fruit,
      totalGramsPerIngredientType,
      totalGramsPerIngredientTypeState
    ),
    [CategoryType.Grain]: calcServing(
      recipe.servings_grain,
      CategoryType.Grain,
      totalGramsPerIngredientType,
      totalGramsPerIngredientTypeState
    ),
    [CategoryType.Dairy]: calcServing(
      recipe.servings_milk_yoghurt_cheese,
      CategoryType.Dairy,
      totalGramsPerIngredientType,
      totalGramsPerIngredientTypeState
    ),
  };

  // const projections = Object.values(CategoryType).reduce((acc, category) => {
  //   acc[category] =
  //     (todayIntakes?.[category] || 0) + (servingPerIngredientType[category] || 0);
  //   return acc;
  // }, {} as Record<CategoryType, number>);

  // console.log('Today Intakes:', todayIntakes);
  // console.log('Projections:', projections);

  const [hasConfirmed, setHasConfirmed] = useState(false);

  function handleConfirm() {
    setHasConfirmed(true);
  }

  function handleSkip(ingredientId: number) {
    setMenuIngredients((prev) =>
      prev.map((ing) =>
        ing.ingredient.ingredient_id === ingredientId
          ? { ...ing, skipped: true }
          : ing
      )
    );
  }

  function handleRestore(ingredientId: number) {
    setMenuIngredients((prev) =>
      prev.map((ing) =>
        ing.ingredient.ingredient_id === ingredientId
          ? { ...ing, skipped: false }
          : ing
      )
    );
  }

  function handleSelectAlternative(oldIngredientId: number, newIngredientId: number) {
    const newIngredient = mockIngredients.find((i) => i.ingredient_id === newIngredientId);
    if (newIngredient) {
      setMenuIngredients((prev) =>
        prev.map((ing) =>
          ing.ingredient.ingredient_id === oldIngredientId
            ? { ...ing, ingredient: newIngredient }
            : ing
        )
      );
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <PageHead
        title={`${recipe.recipe_name} for ${child.name}`}
        description={`Feed ${child.name} the recipe ${recipe.recipe_name}`}
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
      <ScrollView>
        <PageContainer>
          <BackButton fallbackUrl={`/(tabs)/diet/${child_id}/feed`} />
          <Text className="!text-2xl font-bold mb-4">{recipe.recipe_name}</Text>
          <View className="grid md:grid-cols-2 gap-4">
            <View className="order-2 md:order-1">
              <Accordion type="multiple" collapsible>
                <AccordionItem value="steps">
                  <AccordionTrigger>
                    <Text className="!text-xl font-bold mb-4">Steps</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <View className="gap-2">
                      {steps.map((step, index) => (
                        <Text key={index} className="!text-base">
                          {step}
                        </Text>
                      ))}
                    </View>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ingredients">
                  <AccordionTrigger>
                    <Text className="!text-xl font-bold mb-4">Ingredients</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <View className="gap-2">
                      {menuIngredients.map((mi) => (
                        <IngredientCard
                          key={mi.ingredient.ingredient_id}
                          ingredient={mi.ingredient}
                          grams={mi.grams}
                          // onSkip={handleSkip}
                          // onFindAlternative={handleFindAlternative}
                          onChangeAmount={handleChangeAmount}
                          onSelectAlternative={(newIngredientId) => handleSelectAlternative(mi.ingredient.ingredient_id, newIngredientId)}
                          onSkip={handleSkip}
                          onRestore={handleRestore}
                          skipped={mi.skipped}
                        />
                      ))}
                    </View>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </View>
            <View className="order-1 md:order-2">
              <View className="flex-row justify-center gap-4 ">
                {todayIntakes && (
                  <NutritionRings
                    values={todayIntakes}
                    projection={servingPerIngredientType}
                    target={{
                      vegetable: 6,
                      protein: 5,
                      fruit: 6,
                      grain: 4,
                      dairy: 4,
                    }}
                  />
                )}
                <NutritionLabels />
              </View>
              <ConfirmDialog
                description={`Do you want to feed ${recipe.recipe_name} to ${child.name}?`}
                confirmText="Yup!"
                cancelText="Cancel"
                onConfirm={handleConfirm}
              >
                <Button className="hidden md:flex mt-8">
                  <Text>Looks good!</Text>
                </Button>
              </ConfirmDialog>
            </View>
          </View>
          <ConfirmDialog
            description={`Do you want to feed ${recipe.recipe_name} to ${child.name}?`}
            confirmText="Yup!"
            cancelText="Cancel"
            onConfirm={handleConfirm}
          >
            <Button className="md:hidden">
              <Text>Looks good!</Text>
            </Button>
          </ConfirmDialog>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
