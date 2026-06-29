/**
 * Shared API types — the response envelope every endpoint returns.
 *   { data, meta, error }
 */
export interface ApiMeta {
  [key: string]: unknown;
  cursor?: string | null;
  nextCursor?: string | null;
  hasMore?: boolean;
  count?: number;
  cached?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: ApiMeta;
  error: ApiError | null;
}

export const ok = <T>(data: T, meta: ApiMeta = {}): ApiResponse<T> => ({
  data,
  meta,
  error: null,
});

export const fail = (error: ApiError, meta: ApiMeta = {}): ApiResponse<null> => ({
  data: null,
  meta,
  error,
});
