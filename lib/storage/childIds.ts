// Lightweight cross-platform storage helpers for multiple child_ids
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

const KEY = 'child_ids'; // Stores JSON array of strings

// ---------- Helpers ----------
function parseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeIds(ids: string[]): string {
  return JSON.stringify([...new Set(ids)]); // Deduplicate
}

// ---------- Public API ----------

// Add one or more child IDs
export async function addChildIds(...ids: string[]): Promise<void> {
  const AS = await getAsyncStorage();
  const currentIds = await getChildIds();

  const updated = [...currentIds, ...ids];
  const serialized = serializeIds(updated);

  if (AS) {
    try {
      await AS.setItem(KEY, serialized);
      return;
    } catch {}
  }
  if (hasLocalStorage()) {
    try {
      (globalThis as any).localStorage.setItem(KEY, serialized);
      return;
    } catch {}
  }
  memoryStore[KEY] = serialized;
}

// Get all child IDs
export async function getChildIds(): Promise<string[]> {
  const AS = await getAsyncStorage();

  if (AS) {
    try {
      const v = await AS.getItem(KEY);
      return parseIds(v);
    } catch {}
  }

  if (hasLocalStorage()) {
    try {
      const v = (globalThis as any).localStorage.getItem(KEY);
      return parseIds(v);
    } catch {}
  }

  return parseIds(memoryStore[KEY] ?? null);
}

// Remove a specific child ID
export async function removeChildId(id: string): Promise<void> {
  const currentIds = await getChildIds();
  const updated = currentIds.filter(existingId => existingId !== id);
  const serialized = serializeIds(updated);

  const AS = await getAsyncStorage();
  if (AS) {
    try {
      await AS.setItem(KEY, serialized);
      return;
    } catch {}
  }
  if (hasLocalStorage()) {
    try {
      (globalThis as any).localStorage.setItem(KEY, serialized);
      return;
    } catch {}
  }
  memoryStore[KEY] = serialized;
}

// Clear all stored child IDs
export async function clearChildIds(): Promise<void> {
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