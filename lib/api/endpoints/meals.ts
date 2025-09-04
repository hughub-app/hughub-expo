import { Intakes } from '@/types';
import { makeCrud } from '../crud';
import type { components } from '@/generated/api';

export type Meal = components['schemas']['Meal'];
export type CreateMeal = components['schemas']['CreateMeal'];
export type UpdateMeal = components['schemas']['UpdateMeal'];
export type MealList = Meal[];
type MealrenQuery = undefined; // no query params in the spec

// keep the literal paths so your api client matches correctly
const crud = makeCrud<
  Meal,        // TItem
  CreateMeal,  // TCreate (your spec posts a Meal)
  UpdateMeal,  // TUpdate (your spec puts a Meal)
  MealList,    // TList (non-paginated array)
  MealrenQuery,// TListQuery
  number       // TId
>({
  basePath: '/meal/',                // note the trailing slash if your spec has it
  byIdPath: '/meal/{child_id}',      // matches the spec
  idParam: 'child_id',
});

export const listMeals = crud.list;
export const createMeal = crud.create;
export const getMeal = crud.get;
export const updateMeal = crud.update;
export const deleteMeal = crud.remove;