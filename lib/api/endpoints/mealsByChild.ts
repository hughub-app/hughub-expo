import { makeReadResource } from '../crud';
import { Meal } from './meals';

// keep the literal paths so your api client matches correctly
const crud = makeReadResource<
  Meal[],        // TItem
  Meal[],  // TCreate (your spec posts a Meal)
  undefined,// TListQuery
  number       // TId
>({
  basePath: '/meals/child/{child_id}',                // note the trailing slash if your spec has it
  idParam: 'child_id',
});

export const getMeal = crud.get;