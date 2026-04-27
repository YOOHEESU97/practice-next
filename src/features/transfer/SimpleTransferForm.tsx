"use client";

import { FormEvent, useState } from "react";
import { API_CODES } from "@/src/constants/api-codes";
import { formatKRW } from "@/src/lib/format";
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";

function parseAmount(raw: string): { ok: true; value: number } | { ok: false } {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return { ok: false };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return { ok: false };
  if (n <= 0) return { ok: false };
  return { ok: true, value: n };
}

export function SimpleTransferForm() {
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    | { kind: "idle" }
    | { kind: "success"; message: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const parsed = parseAmount(amount);
  const showError = touched && !parsed.ok && amount.trim() !== "";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    setFeedback({ kind: "idle" });

    if (!parsed.ok) {
      setFeedback({
        kind: "error",
        message: "0보다 큰 정수 금액을 입력해 주세요.",
      });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);

    setFeedback({
      kind: "success",
      message: `${formatKRW(parsed.value)} 이체 요청이 접수되었습니다. (연습용 모의 응답, 코드: ${API_CODES.OK})`,
    });
    setAmount("");
    setTouched(false);
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
        금액 보내기 (연습)
      </h2>
      <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
        클라이언트 검증만 적용했습니다. 실제 이체는 일어나지 않습니다.
      </p>

      <form className="mt-4 space-y-3" onSubmit={(e) => void onSubmit(e)} noValidate>
        <div>
          <label
            htmlFor="transfer-amount"
            className="mb-1 block text-sm font-medium text-[var(--color-foreground)]"
          >
            금액 (원)
          </label>
          <Input
            id="transfer-amount"
            name="amount"
            inputMode="numeric"
            autoComplete="off"
            placeholder="예: 10000"
            value={amount}
            invalid={showError}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={
              showError || feedback.kind !== "idle"
                ? "transfer-amount-hint"
                : undefined
            }
          />
          <p id="transfer-amount-hint" className="mt-1 min-h-[1.25rem] text-xs">
            {showError ? (
              <span className="text-red-600 dark:text-red-400">
                올바른 금액을 입력해 주세요.
              </span>
            ) : null}
            {feedback.kind === "error" ? (
              <span className="text-red-600 dark:text-red-400" role="alert">
                {feedback.message}
              </span>
            ) : null}
            {feedback.kind === "success" ? (
              <span className="text-emerald-700 dark:text-emerald-400" role="status">
                {feedback.message}
              </span>
            ) : null}
          </p>
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "처리 중…" : "보내기"}
        </Button>
      </form>
    </section>
  );
}
