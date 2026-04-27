const krwFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function formatKRW(amount: number): string {
  return krwFormatter.format(amount);
}

/** 계좌번호 마스킹: 끝 4자리만 노출 */
export function maskAccountNo(accountNo: string): string {
  const digits = accountNo.replace(/\D/g, "");
  if (digits.length === 0) return "—";
  if (digits.length <= 4) return "*".repeat(digits.length);
  return `****-${digits.slice(-4)}`;
}
