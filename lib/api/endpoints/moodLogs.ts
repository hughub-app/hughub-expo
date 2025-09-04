import { api } from '@/lib/api/client';

export type LogMoodParams = {
  childId: number;
  mood: string; // e.g., 'happy'
  notes?: string;
};

/**
 * Logs mood via JSON body (preferred):
 * POST /mood_logs/
 * Body: { child_id: number, mood: string, notes?: string }
 */
export async function logMood({ childId, mood, notes }: LogMoodParams): Promise<Response> {
  const res = await api.POST('/mood_logs/', {
    body: { child_id: childId, mood, notes } as any,
  });
  return res.response;
}
