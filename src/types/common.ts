// src/types/common.ts

// 모든 금융 API 응답의 기본 구조
export interface ApiResponse<T> {
    status: 'SUCCESS' | 'ERROR';
    code: string;        // 예: 'AUTH_001', 'BALANCE_INSUFFICIENT'
    message: string;     // 사용자에게 보여줄 메시지
    data: T;             // 실제 데이터 (계좌 목록, 잔액 등)
  }
  
  // 페이지네이션이 필요한 목록 데이터 형식
  export interface PaginatedResponse<T> {
    list: T[];
    totalCount: number;
    currentPage: number;
    hasNextPage: boolean;
  }