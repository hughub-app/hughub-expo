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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <PageContainer>
          <BackButton fallbackUrl={`/(tabs)/diet/${child_id}/feed`} />
          <Text className="!text-2xl font-bold">{recipe.recipe_name}</Text>
          <Accordion type="single" collapsible>
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
                <View className="gap-2"></View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
