import { DietSuggestion } from "@/types";
import { mockIngredients } from "./mockIngredients";

export const mockDietSuggestions: DietSuggestion[] = [
  {
    description: "High protein breakfast for active children.",
    ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[2]]
  },
  {
    description: "Vegetarian lunch option with balanced nutrients.",
    ingredients: [mockIngredients[3], mockIngredients[4], mockIngredients[5]]
  },
  {
    description: "Nut-free snack for allergy-sensitive kids.",
    ingredients: [mockIngredients[6], mockIngredients[7]]
  },
  {
    description: "Low-carb dinner for healthy growth.",
    ingredients: [mockIngredients[8], mockIngredients[9], mockIngredients[1]]
  },
  {
    description: "Fiber-rich meal for digestive health.",
    ingredients: [mockIngredients[2], mockIngredients[4], mockIngredients[7]]
  }
];
