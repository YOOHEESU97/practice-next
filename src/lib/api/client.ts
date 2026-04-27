import type { ApiResponse } from "@/src/types/common";

export class ApiHttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiHttpError";
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiHttpError(`요청에 실패했습니다. (${res.status})`, res.status);
  }

  return (await res.json()) as ApiResponse<T>;
}
