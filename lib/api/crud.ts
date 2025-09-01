// crud.ts
import { api, withAuth } from "./client";
import type { components } from "@/generated/api";

export type ErrorSchema = components["schemas"]["Error"];
export async function toErrorMessage(resp: Response): Promise<string> {
  try {
    const ct = resp.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
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

/* -------------------------- READ-ONLY RESOURCES -------------------------- */

export type ReadOptions<
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  /** e.g. '/recipes/ingredients' */
  basePath: string;
  /** provide both of these to enable get(id) */
  byIdPath?: string;      // e.g. '/children/{child_id}'
  idParam?: string;       // e.g. 'child_id'
};

export type ReadResource<
  TItem,
  TList,
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  list(query?: TListQuery, auth?: Auth): Promise<TList>;
  get?: (id: TId, auth?: Auth) => Promise<{ item: TItem; etag?: string }>;
};

export function makeReadResource<
  TItem,
  TList = TItem[],
  TListQuery extends Record<string, any> | undefined = undefined,
  TId extends number | string = number
>(opts: ReadOptions<TListQuery, TId>): ReadResource<TItem, TList, TListQuery, TId> {
  const { basePath, byIdPath, idParam } = opts;

  async function list(query?: TListQuery, auth?: Auth): Promise<TList> {
    const res = await api.GET(basePath as any, {
      params: query ? { query: query as any } : undefined,
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    return res.data as TList;
  }

  let get:
    | ((id: TId, auth?: Auth) => Promise<{ item: TItem; etag?: string }>)
    | undefined;

  if (byIdPath && idParam) {
    get = async (id: TId, auth?: Auth) => {
      const res = await api.GET(byIdPath as any, {
        params: { path: { [idParam]: id } as any },
        ...(auth ? withAuth(auth.token) : {}),
      });
      if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
      const etag = res.response.headers.get("ETag") ?? undefined;
      return { item: res.data as TItem, etag };
    };
  }

  return { list, get };
}

/* ------------------------------- FULL CRUD ------------------------------- */

export type CrudOptions<
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = ReadOptions<TListQuery, TId> & {
  useEtag?: boolean;
  locationHeader?: string;
};

export type CrudResource<
  TItem,
  TCreate extends object,
  TUpdate extends object,
  TList,
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  list(query?: TListQuery, auth?: Auth): Promise<TList>;
  create(body: TCreate, auth?: Auth): Promise<{ item: TItem; location?: string }>;
  get(id: TId, auth?: Auth): Promise<{ item: TItem; etag?: string }>;
  update(
    id: TId,
    body: TUpdate,
    opts?: { etag?: string; token?: string }
  ): Promise<{ item: TItem; etag?: string }>;
  remove(id: TId, opts?: { etag?: string; token?: string }): Promise<void>;
};

export function makeCrud<
  TItem,
  TCreate extends object,
  TUpdate extends object,
  TList = TItem[],
  TListQuery extends Record<string, any> | undefined = undefined,
  TId extends number | string = number
>(opts: CrudOptions<TListQuery, TId>): CrudResource<TItem, TCreate, TUpdate, TList, TListQuery, TId> {
  const {
    basePath,
    byIdPath,
    idParam,
    useEtag = false,
    locationHeader = "Location",
  } = opts;

  if (!byIdPath || !idParam) {
    throw new Error("CRUD resources require byIdPath and idParam.");
  }

  async function list(query?: TListQuery, auth?: Auth): Promise<TList> {
    const res = await api.GET(basePath as any, {
      params: query ? { query: query as any } : undefined,
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    return res.data as TList;
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
      params: { path: { [idParam as string]: id } as any },
      ...(auth ? withAuth(auth.token) : {}),
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    const etag = res.response.headers.get("ETag") ?? undefined;
    return { item: res.data as TItem, etag };
  }

  async function update(
    id: TId,
    body: TUpdate,
    opts?: { etag?: string; token?: string }
  ): Promise<{ item: TItem; etag?: string }> {
    const authHdr = opts?.token ? withAuth(opts.token).headers ?? {} : {};
    const headers = useEtag && opts?.etag ? { "If-Match": opts.etag, ...authHdr } : authHdr;

    const common = {
      params: { path: { [idParam as string]: id } as any },
      body: body as any,
      headers,
    } as const;

    const res = await api.PUT(byIdPath as any, common as any);

    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
    const newEtag = res.response.headers.get("ETag") ?? undefined;
    return { item: res.data as TItem, etag: newEtag };
  }

  async function remove(id: TId, opts?: { etag?: string; token?: string }) {
    const authHdr = opts?.token ? withAuth(opts.token).headers ?? {} : {};
    const headers = useEtag && opts?.etag ? { "If-Match": opts.etag, ...authHdr } : authHdr;

    const res = await api.DELETE(byIdPath as any, {
      params: { path: { [idParam as string]: id } as any },
      headers,
    });
    if (!res.response.ok) throw new Error(await toErrorMessage(res.response));
  }

  return { list, create, get, update, remove };
}