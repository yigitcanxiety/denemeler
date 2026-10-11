import { handlePaddleWebhook } from '@/server/handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(request: Request): Promise<Response> {
  return handlePaddleWebhook(request);
}
