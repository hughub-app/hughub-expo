import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
// if (!baseUrl) {
//   // Crash early so you don't ship a bundle with relative URLs
//   throw new Error('Missing EXPO_PUBLIC_API_URL at build time');
// }

export const api = createClient<paths>({
  baseUrl, // e.g. https://your-flask-api.example.com
  headers: { 'Content-Type': 'application/json' },
});

export const withAuth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};