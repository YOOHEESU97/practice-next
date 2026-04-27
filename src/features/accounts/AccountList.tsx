"use client";

import { useEffect, useState } from "react";
import { API_CODES } from "@/src/constants/api-codes";
import { formatKRW, maskAccountNo } from "@/src/lib/format";
import { fetchAccounts } from "@/src/lib/api/accounts";
import type { Account } from "@/src/types/account";
import { ApiHttpError } from "@/src/lib/api/client";
import { Button } from "@/src/ui/button";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; accounts: Account[] };

function AccountListFetcher({
  simulateError,
  onRetry,
  onToggleSimulate,
}: {
  simulateError: boolean;
  onRetry: () => void;
  onToggleSimulate: () => void;
}) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchAccounts({ simulateError })
      .then((json) => {
        if (cancelled) return;
        if (json.status === "ERROR" || json.code !== API_CODES.OK) {
          setState({
            kind: "error",
            message: json.message || "알 수 없는 오류가 발생했습니다.",
          });
          return;
        }
        setState({ kind: "success", accounts: json.data });
      })
      .catch((e) => {
        if (cancelled) return;
        const message =
          e instanceof ApiHttpError
            ? e.message
            : "네트워크 오류가 발생했습니다.";
        setState({ kind: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [simulateError]);

  if (state.kind === "loading") {
    return (
      <section
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        aria-busy="true"
        aria-live="polite"
      >
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          내 계좌
        </h2>
        <p className="mt-4 text-sm text-[var(--color-foreground-muted)]">
          계좌 목록을 불러오는 중…
        </p>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section
        className="rounded-[var(--radius-lg)] border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30"
        role="alert"
      >
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          내 계좌
        </h2>
        <p className="mt-2 text-sm text-red-800 dark:text-red-200">
          {state.message}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={onRetry}>
            다시 시도
          </Button>
          <Button type="button" variant="secondary" onClick={onToggleSimulate}>
            {simulateError ? "정상 응답으로 테스트" : "에러 응답 시뮬레이션"}
          </Button>
        </div>
      </section>
    );
  }

  if (state.accounts.length === 0) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          내 계좌
        </h2>
        <p className="mt-4 text-sm text-[var(--color-foreground-muted)]">
          등록된 계좌가 없습니다.
        </p>
        <div className="mt-4">
          <Button type="button" variant="secondary" onClick={onToggleSimulate}>
            {simulateError ? "정상 응답으로 테스트" : "에러 응답 시뮬레이션"}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          내 계좌
        </h2>
        <Button
          type="button"
          variant="ghost"
          className="text-xs"
          onClick={onToggleSimulate}
        >
          {simulateError ? "정상 API" : "에러 API 시뮬"}
        </Button>
      </div>
      <ul className="mt-4 divide-y divide-[var(--color-border)]">
        {state.accounts.map((acc) => (
          <li key={acc.id} className="flex flex-col gap-1 py-3 first:pt-0">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              {acc.accountName}
            </span>
            <span className="font-mono text-xs text-[var(--color-foreground-muted)]">
              {maskAccountNo(acc.accountNo)}
            </span>
            <span className="text-base font-semibold tabular-nums text-[var(--color-foreground)]">
              {formatKRW(acc.balance)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AccountList() {
  const [simulateError, setSimulateError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  return (
    <AccountListFetcher
      key={`${simulateError}-${retryToken}`}
      simulateError={simulateError}
      onRetry={() => setRetryToken((t) => t + 1)}
      onToggleSimulate={() => setSimulateError((v) => !v)}
    />
  );
}
