import { handleHealth } from '@/server/handlers';
import { preflightResponse } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return handleHealth();
}

export function OPTIONS(): Response {
  return preflightResponse();
}
