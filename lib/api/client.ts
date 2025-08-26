// src/lib/api/client.ts
import createClient from 'openapi-fetch';
import type { paths } from '@/generated/api';

export const api = createClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_URL, // set EXPO_PUBLIC_API_URL
  headers: { 'Content-Type': 'application/json' },
});

export const withAuth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};