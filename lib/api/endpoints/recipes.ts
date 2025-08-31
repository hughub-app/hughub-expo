import { makeCrud } from '../crud';
import type { paths, components } from '@/generated/api';

export type Recipe = components['schemas']['Recipe'];
export type RecipeCreate = components['schemas']['RecipeCreate'];
export type RecipeUpdate = components['schemas']['RecipeUpdate'];
export type Paginated_Recipe = components['schemas']['Paginated_Recipe'];
export type RecipesQuery =
  paths['/recipes']['get']['parameters']['query']; // typed query

const crud = makeCrud<
  Recipe,
  RecipeCreate,
  RecipeUpdate,
  Paginated_Recipe,
  RecipesQuery,
  number
>({
  basePath: '/recipes',
  byIdPath: '/recipes/{recipe_id}',
  idParam: 'recipe_id',
});

export const listRecipes = crud.list;
export const createRecipe = crud.create;
export const getRecipe = crud.get;
export const updateRecipe = crud.update;
export const deleteRecipe = crud.remove;