import { View, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
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

export default function RecipePage() {
  const { child_id, recipe_id } = useLocalSearchParams<{
    recipe_id: string;
    child_id: string;
  }>();

  const recipe = mockRecipes.find((r) => r.recipe_id === Number(recipe_id));

  if (!recipe) {
    return (
      <View>
        <Text>Recipe not found</Text>
      </View>
    );
  }

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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <PageContainer>
          <BackButton fallbackUrl={`/(tabs)/diet/${child_id}/feed`} />
          <Text className="!text-2xl font-bold">{recipe.recipe_name}</Text>
          <View className="grid md:grid-cols-2">
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
                    {menuIngredients.map((ingredient) => (
                      <IngredientCard
                        key={ingredient.ingredient.ingredient_id}
                        ingredient={ingredient.ingredient}
                        grams={ingredient.grams}
                        // onSkip={handleSkip}
                        // onFindAlternative={handleFindAlternative}
                        onChangeAmount={handleChangeAmount}
                      />
                    ))}
                  </View>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </View>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
