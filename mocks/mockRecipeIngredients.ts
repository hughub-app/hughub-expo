import { RecipeIngredient } from "@/lib/api/endpoints/recipeIngredients";

export const mockRecipeIngredients: RecipeIngredient[] = [
  // --- Recipe 1: Vegetable Stir Fry ---
  {
    recipe_ingredient_id: 1,
    recipe_id: 1,
    ingredient_id: 2,
    grams: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Broccoli
  {
    recipe_ingredient_id: 2,
    recipe_id: 1,
    ingredient_id: 8,
    grams: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Tomato
  {
    recipe_ingredient_id: 3,
    recipe_id: 1,
    ingredient_id: 10,
    grams: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Rice
  {
    recipe_ingredient_id: 4,
    recipe_id: 1,
    ingredient_id: 11,
    grams: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Soy Sauce (NEW)
  {
    recipe_ingredient_id: 5,
    recipe_id: 1,
    ingredient_id: 12,
    grams: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Olive Oil (NEW)
  {
    recipe_ingredient_id: 6,
    recipe_id: 1,
    ingredient_id: 13,
    grams: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Garlic (NEW)

  // --- Recipe 2: Grilled Chicken Salad ---
  {
    recipe_ingredient_id: 7,
    recipe_id: 2,
    ingredient_id: 3,
    grams: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Chicken Breast
  {
    recipe_ingredient_id: 8,
    recipe_id: 2,
    ingredient_id: 14,
    grams: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Lettuce (NEW)
  {
    recipe_ingredient_id: 9,
    recipe_id: 2,
    ingredient_id: 8,
    grams: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Tomato
  {
    recipe_ingredient_id: 10,
    recipe_id: 2,
    ingredient_id: 15,
    grams: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Cucumber (NEW)
  {
    recipe_ingredient_id: 11,
    recipe_id: 2,
    ingredient_id: 12,
    grams: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Olive Oil (NEW)
  {
    recipe_ingredient_id: 12,
    recipe_id: 2,
    ingredient_id: 9,
    grams: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Peanut
  {
    recipe_ingredient_id: 13,
    recipe_id: 2,
    ingredient_id: 5,
    grams: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Whole Wheat Bread (croutons)

  // --- Recipe 3: Spaghetti Bolognese ---
  {
    recipe_ingredient_id: 14,
    recipe_id: 3,
    ingredient_id: 16,
    grams: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Spaghetti (NEW)
  {
    recipe_ingredient_id: 15,
    recipe_id: 3,
    ingredient_id: 17,
    grams: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Beef Mince (NEW)
  {
    recipe_ingredient_id: 16,
    recipe_id: 3,
    ingredient_id: 8,
    grams: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Tomato
  {
    recipe_ingredient_id: 17,
    recipe_id: 3,
    ingredient_id: 12,
    grams: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Olive Oil (NEW)
  {
    recipe_ingredient_id: 18,
    recipe_id: 3,
    ingredient_id: 18,
    grams: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Onion (NEW)
  {
    recipe_ingredient_id: 19,
    recipe_id: 3,
    ingredient_id: 13,
    grams: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Garlic (NEW)
  {
    recipe_ingredient_id: 20,
    recipe_id: 3,
    ingredient_id: 19,
    grams: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Cheese (Parmesan, NEW)
  {
    recipe_ingredient_id: 21,
    recipe_id: 3,
    ingredient_id: 20,
    grams: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Carrot (NEW)

  // --- Recipe 4: Fruit Smoothie ---
  {
    recipe_ingredient_id: 22,
    recipe_id: 4,
    ingredient_id: 21,
    grams: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Banana (NEW)
  {
    recipe_ingredient_id: 23,
    recipe_id: 4,
    ingredient_id: 22,
    grams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Mixed Berries (NEW)
  {
    recipe_ingredient_id: 24,
    recipe_id: 4,
    ingredient_id: 23,
    grams: 250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Almond Milk (NEW)
  {
    recipe_ingredient_id: 25,
    recipe_id: 4,
    ingredient_id: 24,
    grams: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Honey (NEW)
  {
    recipe_ingredient_id: 26,
    recipe_id: 4,
    ingredient_id: 9,
    grams: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Peanut (optional)
  {
    recipe_ingredient_id: 27,
    recipe_id: 4,
    ingredient_id: 1,
    grams: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Apple

  // --- Recipe 5: Lentil Soup ---
  {
    recipe_ingredient_id: 28,
    recipe_id: 5,
    ingredient_id: 25,
    grams: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Lentils (NEW)
  {
    recipe_ingredient_id: 29,
    recipe_id: 5,
    ingredient_id: 18,
    grams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Onion (NEW)
  {
    recipe_ingredient_id: 30,
    recipe_id: 5,
    ingredient_id: 20,
    grams: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Carrot (NEW)
  {
    recipe_ingredient_id: 31,
    recipe_id: 5,
    ingredient_id: 8,
    grams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Tomato
  {
    recipe_ingredient_id: 32,
    recipe_id: 5,
    ingredient_id: 12,
    grams: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Olive Oil (NEW)
  {
    recipe_ingredient_id: 33,
    recipe_id: 5,
    ingredient_id: 13,
    grams: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Garlic (NEW)
  {
    recipe_ingredient_id: 34,
    recipe_id: 5,
    ingredient_id: 4,
    grams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Potato
  {
    recipe_ingredient_id: 35,
    recipe_id: 5,
    ingredient_id: 26,
    grams: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, // Mixed Spices (NEW)
];
