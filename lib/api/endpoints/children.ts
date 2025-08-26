import { makeCrud } from '../crud';
import type { paths, components } from '@/generated/api';

export type Child = components['schemas']['Child'];
export type ChildCreate = components['schemas']['ChildCreate'];
export type ChildUpdate = components['schemas']['ChildUpdate'];
export type Paginated_Child = components['schemas']['Paginated_Child'];
export type ChildrenQuery =
  paths['/children']['get']['parameters']['query']; // typed query params

const crud = makeCrud<
  Child,
  ChildCreate,
  ChildUpdate,
  Paginated_Child,
  ChildrenQuery,
  number
>({
  basePath: '/children',
  byIdPath: '/children/{child_id}',
  idParam: 'child_id',
});

export const listChildren = crud.list;
export const createChild = crud.create;
export const getChild = crud.get;
export const updateChild = crud.update;
export const deleteChild = crud.remove;