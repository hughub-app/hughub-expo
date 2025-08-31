import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { mockRecipes } from "@/mocks/mockRecipes";
import PageContainer from "@/components/PageContainer";

export default function RecipePage() {
  const { recipe_id } = useLocalSearchParams<{ recipe_id: string }>();

  const recipe = mockRecipes.find((r) => r.recipe_id === Number(recipe_id));

  if (!recipe) {
    return (
      <View>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
        <ScrollView>
            <PageContainer>
                <Text>{recipe.recipe_name}</Text>
            </PageContainer>
        </ScrollView>
        
    </SafeAreaView>
  );
}
