// crud.ts
import { api, withAuth } from "./client";
import type { components } from "@/generated/api";
import { Toast } from "toastify-react-native";

/* ============================= Types & helpers ============================= */

export type ErrorSchema = components["schemas"]["Error"];
type Auth = { token?: string };

export async function toErrorMessage(resp: Response): Promise<string> {
  try {
    const ct = resp.headers.get("content-type") ?? "";
    if (ct.includes("application/json") || ct.includes("+json")) {
      const body = (await resp.json()) as any;
      const msg =
        body?.message ??
        body?.error?.message ??
        body?.detail ??
        body?.title ??
        (Array.isArray(body?.errors) ? body.errors.join(", ") : undefined);
      if (msg) return `${msg} (${resp.status})`;
      return `HTTP ${resp.status}`;
    }
    const text = await resp.text();
    if (text) return `${text} (${resp.status})`;
  } catch {}
  return `HTTP ${resp.status}`;
}

type HandleErrorOpts = {
  /** Path to redirect to on 401. Set null to disable redirect. */
  loginPath?: string | null;
  /** Override messages for specific status codes. */
  statusMessages?: Partial<Record<number, string>>;
};

const DEFAULT_ERR_OPTS: Required<HandleErrorOpts> = {
  loginPath: "/login",
  statusMessages: {},
};

async function notifyHttpError(resp: Response, opts?: HandleErrorOpts) {
  const { loginPath, statusMessages } = { ...DEFAULT_ERR_OPTS, ...opts };
  const status = resp.status;
  const msgBody = await toErrorMessage(resp);
  const message = statusMessages[status] ?? msgBody ?? `HTTP ${status}`;

  console.log("HTTP Error:", message);
  if (status === 401) {
    Toast.error("Session expired. Please log in again.");
    // if (loginPath) router.replace(loginPath);
  } else if (status === 403) {
    Toast.error("You do not have permission to perform this action.");
  } else if (status >= 500) {
    Toast.error("Server error. Please try again later.");
  } else {
    Toast.error(typeof message === "string" ? message : "Something went wrong.");
  }
}

function notifyNetworkError(e: unknown) {
  // Prefer a generic message consistent with your Axios interceptor
  Toast.error("Network error. Please check your connection or server address.");
}

function errorToMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try { return String(e); } catch { return "Unexpected error"; }
}

/** Per-call options shared by all methods. */
type CommonCallOpts = {
  auth?: Auth;
  error?: HandleErrorOpts;
  /** If true, throw after toasting; otherwise return fallback. Default: false. */
  throwError?: boolean;
};

/* ============================ Read-only resource =========================== */

export type ReadOptions<
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  /** e.g. '/recipes/ingredients' */
  basePath: string;
  /** Provide both to enable get(id). */
  byIdPath?: string; // e.g. '/children/{child_id}'
  idParam?: string; // e.g. 'child_id'
  /** Optional fallback for list() on error. Default: [] as any */
  fallbackList?: () => any;
};

export type ReadResource<
  TItem,
  TList,
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  /** On error: toast + (fallback TList) or throw if throwError */
  list(query?: TListQuery, opts?: CommonCallOpts): Promise<TList>;
  /** On error: toast + null or throw if throwError */
  get?: (id: TId, opts?: CommonCallOpts) => Promise<{ item: TItem; etag?: string } | null>;
};

export function makeReadResource<
  TItem,
  TList = TItem[],
  TListQuery extends Record<string, any> | undefined = undefined,
  TId extends number | string = number
>(opts: ReadOptions<TListQuery, TId>): ReadResource<TItem, TList, TListQuery, TId> {
  const { basePath, byIdPath, idParam, fallbackList } = opts;
  const listFallback = ((): TList =>
    fallbackList ? (fallbackList() as TList) : ([] as unknown as TList)) as () => TList;

  async function list(query?: TListQuery, optsArg?: CommonCallOpts): Promise<TList> {
    try {
      const res = await api.GET(basePath as any, {
        params: query ? { query: query as any } : undefined,
        ...(optsArg?.auth ? withAuth(optsArg.auth.token) : {}),
      });
      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return listFallback();
      }
      return res.data as TList;
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return listFallback();
    }
  }

  let get:
    | ((id: TId, opts?: CommonCallOpts) => Promise<{ item: TItem; etag?: string } | null>)
    | undefined;

  if (byIdPath && idParam) {
    get = async (id: TId, optsArg?: CommonCallOpts) => {
      try {
        const res = await api.GET(byIdPath as any, {
          params: { path: { [idParam]: id } as any },
          ...(optsArg?.auth ? withAuth(optsArg.auth.token) : {}),
        });
        if (!res.response.ok) {
          await notifyHttpError(res.response, optsArg?.error);
          if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
          return null;
        }
        const etag = res.response.headers.get("ETag") ?? undefined;
        return { item: res.data as TItem, etag };
      } catch (e) {
        notifyNetworkError(e);
        if (optsArg?.throwError) throw new Error(errorToMessage(e));
        return null;
      }
    };
  }

  return { list, get };
}

/* ================================== CRUD ================================== */

export type CrudOptions<
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = ReadOptions<TListQuery, TId> & {
  useEtag?: boolean;
  locationHeader?: string;

  // Optional fallbacks for non-throw mode
  fallbackCreate?: () => null; // default null
  fallbackGet?: () => null; // default null
  fallbackUpdate?: () => null; // default null
  fallbackRemove?: () => boolean; // default false
};

export type CrudResource<
  TItem,
  TCreate extends object,
  TUpdate extends object,
  TList,
  TListQuery extends Record<string, any> | undefined,
  TId extends number | string
> = {
  /** On error: toast + (fallback TList) or throw if throwError */
  list(query?: TListQuery, opts?: CommonCallOpts): Promise<TList>;
  /** On error: toast + null or throw if throwError */
  create(
    body: TCreate,
    opts?: CommonCallOpts
  ): Promise<{ item: TItem; location?: string } | null>;
  /** On error: toast + null or throw if throwError */
  get(id: TId, opts?: CommonCallOpts): Promise<{ item: TItem; etag?: string } | null>;
  /** On error: toast + null or throw if throwError */
  update(
    id: TId,
    body: TUpdate,
    opts?: { etag?: string } & CommonCallOpts
  ): Promise<{ item: TItem; etag?: string } | null>;
  /** On error: toast + false or throw if throwError */
  remove(id: TId, opts?: { etag?: string } & CommonCallOpts): Promise<boolean>;
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
    fallbackList,
    fallbackCreate,
    fallbackGet,
    fallbackUpdate,
    fallbackRemove,
  } = opts;

  if (!byIdPath || !idParam) {
    throw new Error("CRUD resources require byIdPath and idParam.");
  }

  const listFallback = ((): TList =>
    fallbackList ? (fallbackList() as TList) : ([] as unknown as TList)) as () => TList;

  async function list(query?: TListQuery, optsArg?: CommonCallOpts): Promise<TList> {
    try {
      const res = await api.GET(basePath as any, {
        params: query ? { query: query as any } : undefined,
        ...(optsArg?.auth ? withAuth(optsArg.auth.token) : {}),
      });
      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return listFallback();
      }
      return res.data as TList;
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return listFallback();
    }
  }

  async function create(
    body: TCreate,
    optsArg?: CommonCallOpts
  ): Promise<{ item: TItem; location?: string } | null> {
    try {
      const res = await api.POST(basePath as any, {
        body: body as any,
        ...(optsArg?.auth ? withAuth(optsArg.auth.token) : {}),
      });
      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return (fallbackCreate?.() ?? null) as null;
      }
      const location = res.response.headers.get(locationHeader) ?? undefined;
      return { item: res.data as TItem, location };
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return (fallbackCreate?.() ?? null) as null;
    }
  }

  async function get(
    id: TId,
    optsArg?: CommonCallOpts
  ): Promise<{ item: TItem; etag?: string } | null> {
    try {
      const res = await api.GET(byIdPath as any, {
        params: { path: { [idParam as string]: id } as any },
        ...(optsArg?.auth ? withAuth(optsArg.auth.token) : {}),
      });
      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return (fallbackGet?.() ?? null) as null;
      }
      const etag = res.response.headers.get("ETag") ?? undefined;
      return { item: res.data as TItem, etag };
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return (fallbackGet?.() ?? null) as null;
    }
  }

  async function update(
    id: TId,
    body: TUpdate,
    optsArg?: { etag?: string } & CommonCallOpts
  ): Promise<{ item: TItem; etag?: string } | null> {
    try {
      const authHdr = optsArg?.auth?.token ? withAuth(optsArg.auth.token).headers ?? {} : {};
      const headers =
        useEtag && optsArg?.etag ? { "If-Match": optsArg.etag, ...authHdr } : authHdr;

      const res = await api.PUT(byIdPath as any, {
        params: { path: { [idParam as string]: id } as any },
        body: body as any,
        headers,
      } as any);

      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return (fallbackUpdate?.() ?? null) as null;
      }
      const newEtag = res.response.headers.get("ETag") ?? undefined;
      return { item: res.data as TItem, etag: newEtag };
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return (fallbackUpdate?.() ?? null) as null;
    }
  }

  async function remove(
    id: TId,
    optsArg?: { etag?: string } & CommonCallOpts
  ): Promise<boolean> {
    try {
      const authHdr = optsArg?.auth?.token ? withAuth(optsArg.auth.token).headers ?? {} : {};
      const headers =
        useEtag && optsArg?.etag ? { "If-Match": optsArg.etag, ...authHdr } : authHdr;

      const res = await api.DELETE(byIdPath as any, {
        params: { path: { [idParam as string]: id } as any },
        headers,
      });
      if (!res.response.ok) {
        await notifyHttpError(res.response, optsArg?.error);
        if (optsArg?.throwError) throw new Error(await toErrorMessage(res.response));
        return fallbackRemove?.() ?? false;
      }
      return true;
    } catch (e) {
      notifyNetworkError(e);
      if (optsArg?.throwError) throw new Error(errorToMessage(e));
      return fallbackRemove?.() ?? false;
    }
  }

  return { list, create, get, update, remove };
}