import { useEffect } from 'react';
import { setChildId } from '../storage/childId';

/**
 * Persist `child_id` whenever it changes.
 * Pass `undefined` or `null` to skip persisting.
 */
export function usePersistChildId(childId?: string | null) {
  useEffect(() => {
    if (childId) {
      setChildId(childId).catch(() => {
        // Silently ignore storage errors to avoid breaking UI
      });
    }
  }, [childId]);
}

