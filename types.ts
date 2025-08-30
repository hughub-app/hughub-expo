export enum CategoryType {
  Vegetable = "vegetable",
  Protein = "protein",
  Fruit = "fruit",
  Grain = "grain",
  Dairy = "dairy",
}

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
  amount: number;
  units: string[];
  nutritionsPer100g?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  servingPer100g: number;
  types: IngredientType[];
  category: CategoryType;
};

export type Intakes = {
  [CategoryType.Vegetable]: number;
  [CategoryType.Protein]: number;
  [CategoryType.Fruit]: number;
  [CategoryType.Grain]: number;
  [CategoryType.Dairy]: number;
}

export type DietSuggestion = {
  description: string;
  ingredients: Ingredient[];
}