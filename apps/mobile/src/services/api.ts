import { createApiClient } from '@/lib/api';
import { createDemoApiClient } from '@/lib/demo-api';
import { env, isWebDemo } from '@/lib/env';

/** Tonelle API client bound to EXPO_PUBLIC_API_URL (offline demo client in the web preview). */
export const api = isWebDemo ? createDemoApiClient() : createApiClient({ baseUrl: env.apiUrl });
