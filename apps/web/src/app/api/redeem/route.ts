import { handleRedeem } from '@/server/handlers';
import { preflightResponse } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(request: Request): Promise<Response> {
  return handleRedeem(request);
}

export function OPTIONS(): Response {
  return preflightResponse();
}
