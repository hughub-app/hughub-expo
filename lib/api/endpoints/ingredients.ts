import { makeReadResource } from "../crud";
import type { paths, components } from "@/generated/api";

export type Ingredient = components["schemas"]["Ingredient"];
export type IngredientList = Ingredient[];
export type IngredientsQuery =
  paths["/recipes/ingredients"]["get"]["parameters"]["query"];

const ro = makeReadResource<
  Ingredient,
  IngredientList,
  IngredientsQuery,
  number
>({
  basePath: "/recipes/ingredients/",
});

export const listIngredients = ro.list;