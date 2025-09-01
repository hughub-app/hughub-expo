import { makeReadResource } from "../crud";
import type { paths, components } from "@/generated/api";

export type RecipeIngredient = components["schemas"]["RecipeIngredient"];
export type RecipeIngredientList = RecipeIngredient[];
export type RecipeIngredientsQuery =
  paths["/recipes/recipe_ingredients"]["get"]["parameters"]["query"];

const ro = makeReadResource<
  RecipeIngredient,
  RecipeIngredientList,
  RecipeIngredientsQuery,
  number
>({
  basePath: "/recipes/recipe_ingredients",
});

export const listRecipeIngredients = ro.list;