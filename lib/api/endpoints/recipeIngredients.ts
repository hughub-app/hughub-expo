import { makeCrud } from '../crud';
import type { paths, components } from '@/generated/api';

export type RecipeIngredient = components['schemas']['RecipeIngredient'];
export type RecipeIngredientCreate = components['schemas']['RecipeIngredientCreate'];
export type RecipeIngredientUpdate = components['schemas']['RecipeIngredientUpdate'];
export type Paginated_RecipeIngredient = components['schemas']['Paginated_RecipeIngredient'];
export type RecipeIngredientsQuery =
  paths['/recipe-ingredients']['get']['parameters']['query']; // typed query

const crud = makeCrud<
  RecipeIngredient,
  RecipeIngredientCreate,
  RecipeIngredientUpdate,
  Paginated_RecipeIngredient,
  RecipeIngredientsQuery,
  number
>({
  basePath: '/recipe-ingredients',
  byIdPath: '/recipe-ingredients/{ingredient_id}',
  idParam: 'ingredient_id',
});

export const listRecipeIngredients = crud.list;
export const createRecipeIngredient = crud.create;
export const getRecipeIngredient = crud.get;
export const updateRecipeIngredient = crud.update;
export const deleteRecipeIngredient = crud.remove;