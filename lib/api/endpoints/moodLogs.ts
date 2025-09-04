import { baseUrl } from '@/lib/api/client';

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
  const url = new URL('/mood_logs/', baseUrl);
  const body = JSON.stringify({ child_id: childId, mood, notes });
  return fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}
