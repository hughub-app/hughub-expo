// Lightweight cross-platform storage helpers for child_id
// - Uses AsyncStorage on React Native if available
// - Falls back to localStorage on web
// - Falls back to in-memory if neither is available

let memoryStore: Record<string, string> = {};

function hasLocalStorage(): boolean {
  try {
    return typeof globalThis !== 'undefined' && !!(globalThis as any).localStorage;
  } catch {
    return false;
  }
}

async function getAsyncStorage(): Promise<any | null> {
  // Try to dynamically require AsyncStorage only if present
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@react-native-async-storage/async-storage');
    return mod?.default || mod;
  } catch {
    return null;
  }
}

const KEY = 'child_id';

export async function setChildId(id: string): Promise<void> {
  const AS = await getAsyncStorage();
  if (AS) {
    try {
      await AS.setItem(KEY, id);
      return;
    } catch {}
  }
  if (hasLocalStorage()) {
    try {
      (globalThis as any).localStorage.setItem(KEY, id);
      return;
    } catch {}
  }
  memoryStore[KEY] = id;
}

export async function getChildId(): Promise<string | null> {
  const AS = await getAsyncStorage();
  if (AS) {
    try {
      const v = await AS.getItem(KEY);
      if (typeof v === 'string') return v;
    } catch {}
  }
  if (hasLocalStorage()) {
    try {
      const v = (globalThis as any).localStorage.getItem(KEY);
      if (typeof v === 'string') return v;
    } catch {}
  }
  return memoryStore[KEY] ?? null;
}

export async function clearChildId(): Promise<void> {
  const AS = await getAsyncStorage();
  if (AS) {
    try {
      await AS.removeItem(KEY);
      // Fall through to clear others just in case
    } catch {}
  }
  if (hasLocalStorage()) {
    try {
      (globalThis as any).localStorage.removeItem(KEY);
    } catch {}
  }
  delete memoryStore[KEY];
}

