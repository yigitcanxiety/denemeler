import type { ApiErrorCode } from '@tonelle/shared';

/**
 * An error that maps onto the public `ApiError` shape. `message` is safe to show to clients;
 * `detail` is a short internal summary for logs (never provider bodies, keys or image data).
 */
export class HttpError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly detail?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Failure talking to an upstream AI / billing provider (maps to 502 `provider_error`). */
export class ProviderError extends HttpError {
  constructor(detail: string, message = 'The AI provider failed to respond. Please try again.') {
    super('provider_error', message, detail);
    this.name = 'ProviderError';
  }
}

/** The analysis model reported that no face is visible (maps to 422 `no_face`). */
export class NoFaceError extends HttpError {
  constructor() {
    super('no_face', 'No face was detected in the photo.');
    this.name = 'NoFaceError';
  }
}
