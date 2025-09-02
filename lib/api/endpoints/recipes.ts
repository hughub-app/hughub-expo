import { makeReadResource } from "../crud";
import type { paths, components } from "@/generated/api";

export type Recipe = components["schemas"]["Recipe"];
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