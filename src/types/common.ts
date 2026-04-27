import type { ApiResultCode } from "@/src/constants/api-codes";

export interface ApiResponse<T> {
  status: "SUCCESS" | "ERROR";
  code: ApiResultCode | string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
}
