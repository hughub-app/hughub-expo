import { useEffect, useState } from 'react';
import type { Child } from '@/lib/api/endpoints/children';
import { listChildren } from '@/lib/api/endpoints/children';
import { mockChildren } from '@/mocks/mockChildren';

type State = {
  child: Child | null;
  loading: boolean;
  error: string | null;
};

export function useChildById(id?: number | null) {
  const [state, setState] = useState<State>({ child: null, loading: false, error: null });

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id && id !== 0) {
        if (active) setState({ child: null, loading: false, error: null });
        return;
      }
      if (active) setState((s) => ({ ...s, loading: true, error: null }));
      try {
        // Backend expects GET /children/?ids=<id>
        const list = await listChildren({ ids: String(id) }, { throwError: false });
        if (!active) return;
        const found = Array.isArray(list) ? (list as Child[]).find(c => Number(c.child_id) === Number(id)) ?? null : null;
        if (found) {
          setState({ child: found, loading: false, error: null });
        } else {
          const fallback = mockChildren.find((c) => Number(c.child_id) === Number(id)) ?? null;
          setState({ child: fallback, loading: false, error: fallback ? null : 'Child not found' });
        }
      } catch (e) {
        if (!active) return;
        const fallback = mockChildren.find((c) => Number(c.child_id) === Number(id)) ?? null;
        setState({
          child: fallback,
          loading: false,
          error: fallback ? null : e instanceof Error ? e.message : 'Failed to load child',
        });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
