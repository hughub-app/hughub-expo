import { makeReadResource } from "../crud";
import type { paths, components } from "@/generated/api";

export enum RecipeType {
  Lunch = "Lunch",
  Dinner = "Dinner",
  Dessert = "Dessert",
  Snack = "Snack",
  Breakfast = "Breakfast",
}

export type Recipe = components["schemas"]["Recipe"] & {
  recipeType: RecipeType;
};
export type RecipeList = Recipe[];

export type RecipesQuery =
  paths["/recipes"]["get"]["parameters"]["query"];

const ro = makeReadResource<
  Recipe,
  RecipeList,
  RecipesQuery,
  number
>({
  basePath: "/recipes/",
});

export const listRecipes = ro.list;