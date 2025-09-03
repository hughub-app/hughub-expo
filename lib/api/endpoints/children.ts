import { Intakes } from '@/types';
import { makeCrud } from '../crud';
import type { components } from '@/generated/api';

export type Child = components['schemas']['Child'] & { todayIntakes?: Intakes };
export type ChildList = Child[];
type ChildrenQuery = undefined; // no query params in the spec

// keep the literal paths so your api client matches correctly
const crud = makeCrud<
  Child,        // TItem
  Child,        // TCreate (your spec posts a Child)
  Child,        // TUpdate (your spec puts a Child)
  ChildList,    // TList (non-paginated array)
  ChildrenQuery,// TListQuery
  number        // TId
>({
  basePath: '/children/',                // trailing slash for list
  byIdPath: '/children/{child_id}/',     // many backends require trailing slash for detail
  idParam: 'child_id',
});

export const listChildren  = crud.list;
export const createChild   = crud.create;
export const getChild      = crud.get;
export const updateChild   = crud.update;
export const deleteChild   = crud.remove;
