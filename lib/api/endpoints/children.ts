import { Intakes } from '@/types';
import { makeCrud } from '../crud';
import type { components, paths } from '@/generated/api';

export type Child = components['schemas']['Child'] & { todayIntakes?: Intakes };
export type ChildList = Child[];
type ChildrenQuery = paths['/children/']['get']['parameters']['query']; // no query params in the spec

// keep the literal paths so your api client matches correctly
const crud = makeCrud<
  Child,        // TItem
  Child,        // TCreate (your spec posts a Child)
  Child,        // TUpdate (your spec puts a Child)
  ChildList,    // TList (non-paginated array)
  ChildrenQuery,// TListQuery
  number        // TId
>({
  basePath: '/children/',                // note the trailing slash if your spec has it
  byIdPath: '/children/{child_id}',      // matches the spec
  idParam: 'child_id',
});

export const listChildren  = crud.list;
export const createChild   = crud.create;
export const getChild      = crud.get;
export const updateChild   = crud.update;
export const deleteChild   = crud.remove;