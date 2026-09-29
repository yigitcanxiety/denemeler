import { handleAnalyze } from '@/server/handlers';
import { preflightResponse } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export function POST(request: Request): Promise<Response> {
  return handleAnalyze(request);
}

export function OPTIONS(): Response {
  return preflightResponse();
}
