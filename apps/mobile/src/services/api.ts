import { createApiClient } from '@/lib/api';
import { env } from '@/lib/env';

/** Tonelle API client bound to EXPO_PUBLIC_API_URL. */
export const api = createApiClient({ baseUrl: env.apiUrl });
