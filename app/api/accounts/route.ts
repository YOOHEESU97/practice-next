import { NextResponse } from "next/server";
import { API_CODES } from "@/src/constants/api-codes";
import type { Account } from "@/src/types/account";
import type { ApiResponse } from "@/src/types/common";

const mockAccounts: Account[] = [
  {
    id: "acc-1",
    accountNo: "110123456789",
    accountName: "급여통장",
    balance: 1_250_000,
  },
  {
    id: "acc-2",
    accountNo: "3560012345678",
    accountName: "저축통장",
    balance: 5_432_100,
  },
];

export async function GET(request: Request) {
  const error = new URL(request.url).searchParams.get("error");

  if (error === "1") {
    const body: ApiResponse<Account[]> = {
      status: "ERROR",
      code: API_CODES.UNKNOWN,
      message: "계좌 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      data: [],
    };
    return NextResponse.json(body);
  }

  const body: ApiResponse<Account[]> = {
    status: "SUCCESS",
    code: API_CODES.OK,
    message: "",
    data: mockAccounts,
  };
  return NextResponse.json(body);
}
