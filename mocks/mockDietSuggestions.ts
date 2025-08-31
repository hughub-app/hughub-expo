import { DietSuggestion } from "@/types";
import { mockMenuIngredients } from "./mockMenuIngredients";

export const mockDietSuggestions: DietSuggestion[] = [
  {
    description: "High protein breakfast for active children.",
    ingredients: [mockMenuIngredients[0], mockMenuIngredients[1], mockMenuIngredients[2]]
  },
  {
    description: "Vegetarian lunch option with balanced nutrients.",
    ingredients: [mockMenuIngredients[3], mockMenuIngredients[4], mockMenuIngredients[5]]
  },
  {
    description: "Nut-free snack for allergy-sensitive kids.",
    ingredients: [mockMenuIngredients[6], mockMenuIngredients[7]]
  },
  {
    description: "Low-carb dinner for healthy growth.",
    ingredients: [mockMenuIngredients[8], mockMenuIngredients[9], mockMenuIngredients[1]]
  },
  {
    description: "Fiber-rich meal for digestive health.",
    ingredients: [mockMenuIngredients[2], mockMenuIngredients[4], mockMenuIngredients[7]]
  }
];
