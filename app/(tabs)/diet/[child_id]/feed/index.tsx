import { ScrollView, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { SuccessDialog } from "@/components/SuccessDialog";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import RecipeCard from "@/components/menus/RecipeCard";
import { listRecipes, Recipe, RecipeType } from "@/lib/api/endpoints/recipes";
import { Input } from "@/components/ui/input";
import HHSpinner from "@/components/HHSpinner";

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

  const [hasConfirmed, setHasConfirmed] = useState(false);

  const [loading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [recipeType, setRecipeType] = React.useState<RecipeType | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    listRecipes({
      recipe_name: searchTerm || undefined,
      recipe_type: recipeType || undefined,
    })
      .then((res) => {
        setRecipes(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm, recipeType]);

  const recipeTypes = Object.values(RecipeType);

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
      {/* <ConfirmFeedModal
        child={child}
        visible={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleFinalConfirm}
        ingredients={ingredients}
        childIntake={child.todayIntakes}
      /> */}
      <SafeAreaView className="flex-1">
        <ScrollView>
          <PageContainer>
            <BackButton fallbackUrl={`/(tabs)/diet/${child.child_id}`} />
            <Text className="!text-3xl font-bold">Feed {child.name}</Text>
            <View className="grid md:grid-cols-2 gap-2 mt-4">
              <Select onValueChange={(v) => setRecipeType(v?.value as RecipeType)}>
                <SelectTrigger className="!w-full">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Meal Type</SelectLabel>
                    {
                      recipeTypes.map((type) => (
                        <SelectItem key={type} label={type} value={type} />
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search recipe"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <View className="mt-4">
              {loading ? (
                <HHSpinner />
              ) : (
                <View className="grid md:grid-cols-2 gap-2 mb-4">
                  {recipes.map((recipe) => (
                    <Link
                      href={`/diet/${child.child_id}/feed/${recipe.recipe_id}`}
                    >
                      <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                    </Link>
                  ))}
                </View>
              )}
            </View>
            <Link href={`/diet/${child.child_id}/feed/custom`}>
              <Button className="mt-4">
                <Text>Add New Recipe</Text>
              </Button>
            </Link>
          </PageContainer>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
