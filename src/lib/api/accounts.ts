import { ROUTES } from "@/src/constants/routes";
import type { Account } from "@/src/types/account";
import { apiRequest } from "@/src/lib/api/client";

export function fetchAccounts(options?: { simulateError?: boolean }) {
  const path =
    options?.simulateError === true
      ? `${ROUTES.apiAccounts}?error=1`
      : ROUTES.apiAccounts;
  return apiRequest<Account[]>(path);
}
