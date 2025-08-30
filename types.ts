export enum IngredientType {
  Vegetable = "vegetable",
  Grain = "grain",
  Dairy = "dairy",
  Meat = "meat",
  Protein = "protein",
  Fruit = "fruit",
  Spice = "spice",
  Seafood = "seafood",
  Nut = "nut",
  Other = "other",
}

export type Ingredient = {
  id: string;
  emoji: string;
  name: string;
  amount: string;
  units: string[];
  nutritionsPer100g?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  types: IngredientType[];
};

export type DietSuggestion = {
  description: string;
  ingredients: Ingredient[];
}