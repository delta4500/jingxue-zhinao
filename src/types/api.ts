export interface ApiError {
  code: string;
  message: string;
  recoverable?: boolean;
  suggestedAction?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  traceId: string;
  timestamp?: string;
}
