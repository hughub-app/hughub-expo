import { api, withAuth } from './client';
import type { components } from '@/generated/api';

/** Shared error extractor so we don't duplicate it */
export type ErrorSchema = components['schemas']['Error'];
export async function toErrorMessage(resp: Response): Promise<string> {
  try {
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = (await resp.json()) as Partial<ErrorSchema>;
      if (body?.message) return `${body.message} (${resp.status})`;
    } else {
      const text = await resp.text();
      if (text) return `${text} (${resp.status})`;
    }
  } catch {}
  return `HTTP ${resp.status}`;
}

type Auth = { token?: string };

/** Options to wire a resource into the factory */
export type CrudOptions<
  TItem,
  TCreate,
  TUpdate,
  TPaginated,
  TListQuery,
  TId extends number | string
> = {
  /** e.g. '/nutrients' */
  basePath: `/` | `/${string}`;
  /** e.g. '/nutrients/{nutrient_id}' */
  byIdPath: `/` | `/${string}`;
  /** param name in the byId path, e.g. 'nutrient_id' or 'child_id' */
  idParam: string;
  /** Optional: name of Location header on create (typically 'Location') */
  locationHeader?: string;
};

/** Factory returns strongly-typed CRUD functions.
 * Note: We rely on your OpenAPI spec for runtime shape, and cast to the generic types here.
 * If you also use Zod, validate inside each function after `res.response.ok`.
 */
export function makeCrud<
  TItem,
  TCreate extends object,
  TUpdate extends object,
  TPaginated,
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string = number
>(opts: CrudOptions<TItem, TCreate, TUpdate, TPaginated, TListQuery, TId>) {
  const { basePath, byIdPath, idParam, locationHeader = 'Location' } = opts;

  async function list(query?: TListQuery, auth?: Auth): Promise<TPaginated> {
    const res = await api.GET(basePath as any, {
      params: query ? { query: query as any } : undefined,
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    return res.data as TPaginated;
  }

  async function create(
    body: TCreate,
    auth?: Auth
  ): Promise<{ item: TItem; location?: string }> {
    const res = await api.POST(basePath as any, {
      body: body as any,
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    const location = res.response.headers.get(locationHeader) ?? undefined;
    return { item: res.data as TItem, location };
  }

  async function get(
    id: TId,
    auth?: Auth
  ): Promise<{ item: TItem; etag?: string }> {
    const res = await api.GET(byIdPath as any, {
      params: { path: { [idParam]: id } as any },
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    const etag = res.response.headers.get('ETag') ?? undefined;
    return { item: res.data as TItem, etag };
  }

  async function update(
    id: TId,
    body: TUpdate,
    opts: { etag: string; token?: string }
  ): Promise<{ item: TItem; etag?: string }> {
    const res = await api.PATCH(byIdPath as any, {
      params: { path: { [idParam]: id } as any },
      body: body as any,
      headers: { 'If-Match': opts.etag, ...(withAuth(opts.token).headers ?? {}) },
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    const newEtag = res.response.headers.get('ETag') ?? undefined;
    return { item: res.data as TItem, etag: newEtag };
  }

  async function remove(id: TId, opts: { etag: string; token?: string }) {
    const res = await api.DELETE(byIdPath as any, {
      params: { path: { [idParam]: id } as any },
      headers: { 'If-Match': opts.etag, ...(withAuth(opts.token).headers ?? {}) },
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
  }

  return { list, create, get, update, remove };
}