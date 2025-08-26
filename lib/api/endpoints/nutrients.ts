import { makeCrud } from '../crud';
import type { paths, components } from '@/generated/api';

export type Nutrient = components['schemas']['Nutrient'];
export type NutrientCreate = components['schemas']['NutrientCreate'];
export type NutrientUpdate = components['schemas']['NutrientUpdate'];
export type Paginated_Nutrient = components['schemas']['Paginated_Nutrient'];
export type NutrientsQuery =
  paths['/nutrients']['get']['parameters']['query']; // typed query

const crud = makeCrud<
  Nutrient,
  NutrientCreate,
  NutrientUpdate,
  Paginated_Nutrient,
  NutrientsQuery,
  number
>({
  basePath: '/nutrients',
  byIdPath: '/nutrients/{nutrient_id}',
  idParam: 'nutrient_id',
});

export const listNutrients = crud.list;
export const createNutrient = crud.create;
export const getNutrient = crud.get;
export const updateNutrient = crud.update;
export const deleteNutrient = crud.remove;