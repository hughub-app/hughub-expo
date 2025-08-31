import { makeCrud } from '../crud';
import type { paths, components } from '@/generated/api';

export type Ingredient = components['schemas']['Ingredient'];
export type IngredientCreate = components['schemas']['IngredientCreate'];
export type IngredientUpdate = components['schemas']['IngredientUpdate'];
export type Paginated_Ingredient = components['schemas']['Paginated_Ingredient'];
export type IngredientsQuery =
  paths['/ingredients']['get']['parameters']['query']; // typed query

const crud = makeCrud<
  Ingredient,
  IngredientCreate,
  IngredientUpdate,
  Paginated_Ingredient,
  IngredientsQuery,
  number
>({
  basePath: '/ingredients',
  byIdPath: '/ingredients/{ingredient_id}',
  idParam: 'ingredient_id',
});

export const listIngredients = crud.list;
export const createIngredient = crud.create;
export const getIngredient = crud.get;
export const updateIngredient = crud.update;
export const deleteIngredient = crud.remove;