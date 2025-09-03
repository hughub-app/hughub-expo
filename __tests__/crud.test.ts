// __tests__/crud.test.ts

import type { Mock } from 'jest-mock';

// --- Mocks ------------------------------------------------------------------

// Mock your openapi-fetch client (src/lib/api/client.ts).
// IMPORTANT: type each mock as Promise<any> so paths not in OpenAPI don't collapse to `never`.
jest.mock('@/lib/api/client', () => {
  const GET = jest.fn<Promise<any>, any[]>();
  const POST = jest.fn<Promise<any>, any[]>();
  const PUT = jest.fn<Promise<any>, any[]>();
  const DELETE = jest.fn<Promise<any>, any[]>();
  return {
    api: { GET, POST, PUT, DELETE },
    withAuth: (token?: string) => ({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  };
});

// Mock Toast (toastify-react-native)
jest.mock('toastify-react-native', () => ({
  Toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// (Optional) expo-router (crud imports router only in comments; safe to mock)
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

// --- SUT --------------------------------------------------------------------
import { toErrorMessage, makeReadResource, makeCrud } from '@/lib/api/crud';

const { api } = jest.requireMock('@/lib/api/client') as {
  api: {
    GET: jest.Mock<Promise<any>, any[]>;
    POST: jest.Mock<Promise<any>, any[]>;
    PUT: jest.Mock<Promise<any>, any[]>;
    DELETE: jest.Mock<Promise<any>, any[]>;
  };
};
const { Toast } = jest.requireMock('toastify-react-native') as {
  Toast: { error: Mock; success: Mock; info: Mock };
};

// --- Helpers ----------------------------------------------------------------

function fakeHeaders(map: Record<string, string> = {}) {
  return {
    get: (k: string) => map[k] ?? undefined,
  } as unknown as Headers;
}

function fakeResponse(opts: {
  ok: boolean;
  status: number;
  headers?: Record<string, string>;
  jsonBody?: any;
  textBody?: string;
  contentType?: string;
}) {
  const { ok, status, headers = {}, jsonBody, textBody, contentType } = opts;
  const h = { ...headers };
  if (contentType) h['content-type'] = contentType;
  return {
    response: {
      ok,
      status,
      headers: fakeHeaders(h),
      json: async () => jsonBody,
      text: async () => textBody ?? '',
    },
    data: jsonBody,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Tests ------------------------------------------------------------------

describe('toErrorMessage', () => {
  it('parses JSON message fields', async () => {
    const resp = {
      status: 400,
      headers: fakeHeaders({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Invalid thing' }),
      text: async () => '',
    } as unknown as Response;

    await expect(toErrorMessage(resp)).resolves.toBe('Invalid thing (400)');
  });

  it('joins JSON errors array', async () => {
    const resp = {
      status: 422,
      headers: fakeHeaders({ 'content-type': 'application/json' }),
      json: async () => ({ errors: ['a required', 'b invalid'] }),
      text: async () => '',
    } as unknown as Response;

    await expect(toErrorMessage(resp)).resolves.toBe('a required, b invalid (422)');
  });

  it('falls back to text when not JSON', async () => {
    const resp = {
      status: 500,
      headers: fakeHeaders({ 'content-type': 'text/plain' }),
      json: async () => ({}),
      text: async () => 'Server down',
    } as unknown as Response;

    await expect(toErrorMessage(resp)).resolves.toBe('Server down (500)');
  });

  it('falls back to HTTP code if no body', async () => {
    const resp = {
      status: 404,
      headers: fakeHeaders({}),
      json: async () => ({}),
      text: async () => '',
    } as unknown as Response;

    await expect(toErrorMessage(resp)).resolves.toBe('HTTP 404');
  });
});

describe('makeReadResource', () => {
  type Item = { id: number; name: string };
  const basePath = '/things' as const;
  const byIdPath = '/things/{id}' as const;

  const R = () =>
    makeReadResource<Item, Item[], { q?: string }, number>({
      basePath,
      byIdPath,
      idParam: 'id',
      fallbackList: () => [{ id: -1, name: 'fallback' }],
    });

  it('list: returns data on success', async () => {
    const data = [{ id: 1, name: 'A' }];
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        jsonBody: data,
        contentType: 'application/json',
      }),
    );

    const res = await R().list({ q: 'a' });
    expect(res).toEqual(data);
    expect(api.GET).toHaveBeenCalledWith(
      basePath,
      expect.objectContaining({ params: { query: { q: 'a' } } }),
    );
  });

  it('list: toasts + returns fallback on HTTP error', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 403,
        jsonBody: { message: 'Forbidden' },
        contentType: 'application/json',
      }),
    );

    const res = await R().list();
    expect(Toast.error).toHaveBeenCalled(); // permission toast
    expect(res).toEqual([{ id: -1, name: 'fallback' }]);
  });

  it('list: toasts + returns fallback on network error', async () => {
    api.GET.mockRejectedValue(new Error('Network fail'));
    const res = await R().list();
    expect(Toast.error).toHaveBeenCalledWith(
      'Network error. Please check your connection or server address.',
    );
    expect(res).toEqual([{ id: -1, name: 'fallback' }]);
  });

  it('get: returns item + etag on success', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        jsonBody: { id: 7, name: 'Hello' },
        headers: { ETag: 'abc123' },
        contentType: 'application/json',
      }),
    );

    const res = await R().get!(7);
    expect(res).toEqual({ item: { id: 7, name: 'Hello' }, etag: 'abc123' });
  });

  it('get: returns null on HTTP error and toasts', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 404,
        textBody: 'Not found',
        contentType: 'text/plain',
      }),
    );
    const res = await R().get!(99);
    expect(Toast.error).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('get: throws if throwError true', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 500,
        textBody: 'Boom',
        contentType: 'text/plain',
      }),
    );
    await expect(R().get!(1, { throwError: true })).rejects.toThrow('Boom (500)');
  });
});

describe('makeCrud', () => {
  type Item = { id: number; name: string };
  type Create = { name: string };
  type Update = { name?: string };
  const basePath = '/items' as const;
  const byIdPath = '/items/{id}' as const;

  const C = (useEtag = false) =>
    makeCrud<Item, Create, Update, Item[], { q?: string }, number>({
      basePath,
      byIdPath,
      idParam: 'id',
      useEtag,
      fallbackList: () => [],
      fallbackCreate: () => null,
      fallbackGet: () => null,
      fallbackUpdate: () => null,
      fallbackRemove: () => false,
    });

  it('create: success returns item + location', async () => {
    api.POST.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 201,
        jsonBody: { id: 1, name: 'X' },
        headers: { Location: '/items/1' },
        contentType: 'application/json',
      }),
    );

    const res = await C().create({ name: 'X' });
    expect(res).toEqual({ item: { id: 1, name: 'X' }, location: '/items/1' });
  });

  it('create: HTTP error toasts + returns fallback (null)', async () => {
    api.POST.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 400,
        jsonBody: { message: 'Bad' },
        contentType: 'application/json',
      }),
    );
    const res = await C().create({ name: 'bad' });
    expect(Toast.error).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('get: success returns item + etag', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        jsonBody: { id: 2, name: 'Y' },
        headers: { ETag: 'v2' },
        contentType: 'application/json',
      }),
    );
    const res = await C().get(2);
    expect(res).toEqual({ item: { id: 2, name: 'Y' }, etag: 'v2' });
  });

  it('update: sends If-Match when useEtag=true and etag provided', async () => {
    api.PUT.mockResolvedValue(
      fakeResponse({
        ok: true,
        status: 200,
        jsonBody: { id: 2, name: 'New' },
        headers: { ETag: 'v3' },
        contentType: 'application/json',
      }),
    );

    await C(true).update(2, { name: 'New' }, { etag: 'v2', auth: { token: 't' } });

    const callArgs = api.PUT.mock.calls[0][1];
    expect(callArgs.headers).toMatchObject({ 'If-Match': 'v2', Authorization: 'Bearer t' });
  });

  it('update: HTTP error returns null and toasts', async () => {
    api.PUT.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 409,
        jsonBody: { message: 'Conflict' },
        contentType: 'application/json',
      }),
    );

    const res = await C(true).update(3, { name: 'Z' }, { etag: 'old' });
    expect(Toast.error).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('remove: success returns true', async () => {
    api.DELETE.mockResolvedValue(
      fakeResponse({ ok: true, status: 204, jsonBody: null, contentType: 'application/json' }),
    );
    await expect(C().remove(1)).resolves.toBe(true);
  });

  it('remove: HTTP error returns false and toasts', async () => {
    api.DELETE.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 401,
        jsonBody: { message: 'Unauthorized' },
        contentType: 'application/json',
      }),
    );
    await expect(C().remove(1)).resolves.toBe(false);
    expect(Toast.error).toHaveBeenCalled();
  });

  it('list: throws when throwError=true', async () => {
    api.GET.mockResolvedValue(
      fakeResponse({ ok: false, status: 500, textBody: 'Boom', contentType: 'text/plain' }),
    );
    await expect(C().list(undefined, { throwError: true })).rejects.toThrow('Boom (500)');
  });

  it('create: network error throws if throwError=true, else returns null', async () => {
    api.POST.mockRejectedValue(new Error('offline'));
    await expect(C().create({ name: 'A' }, { throwError: true })).rejects.toThrow('offline');

    api.POST.mockRejectedValue(new Error('offline'));
    await expect(C().create({ name: 'A' })).resolves.toBeNull();
    expect(Toast.error).toHaveBeenCalledWith(
      'Network error. Please check your connection or server address.',
    );
  });
});