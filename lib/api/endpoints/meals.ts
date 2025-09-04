import { makeCrud, makeReadResource } from '../crud';
import type { components, paths } from '@/generated/api';

export type Meal = components['schemas']['Meal'];
export type CreateMeal = components['schemas']['CreateMeal'];
export type UpdateMeal = components['schemas']['UpdateMeal'];
export type MealList = Meal[];
type MealRangeQuery = paths['/meals/range/{child_id}']['get']['parameters']['query']; // query params in the spec

// keep the literal paths so your api client matches correctly
const crud = makeCrud<
  Meal,
  CreateMeal,
  UpdateMeal,
  MealList,
  MealRangeQuery,
  number
>({
  basePath: '/meals/',                // note the trailing slash if your spec has it
  byIdPath: '/meals/{child_id}',      // matches the spec
  idParam: 'child_id',
});

const rangeRead = makeReadResource<
  Meal[],
  Meal[],
  MealRangeQuery,
  number
>({
  basePath: '/meals/range',
  byIdPath: '/meals/range/{child_id}',
  idParam: 'child_id',
});

export const listMeals = crud.list;
export const createMeal = crud.create;
export const getMealByChild = crud.get;
export const updateMeal = crud.update;
export const deleteMeal = crud.remove;

export const getMealsByChildInRange = rangeRead.get;