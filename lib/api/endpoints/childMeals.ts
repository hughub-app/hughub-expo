import { makeReadResource } from '../crud';
import type { paths, components } from '@/generated/api';

export type Meal = components['schemas']['Meal'];
export type CreateMeal = components['schemas']['CreateMeal'];
export type UpdateMeal = components['schemas']['UpdateMeal'];
export type MealList = Meal[];
type MealsQuery = paths["/meals/child/{child_id}"]["get"]["parameters"]["query"];
; // no query params in the spec

// keep the literal paths so your api client matches correctly
const crud = makeReadResource<
  Meal,        // TItem
  Meal[],  // TCreate (your spec posts a Meal)
  MealsQuery,// TListQuery
  number       // TId
>({
  basePath: '/meals/',                // note the trailing slash if your spec has it
  byIdPath: '/meals/{child_id}',      // matches the spec
  idParam: 'child_id',
});

export const listMeals = crud.list;
export const getMeal = crud.get;