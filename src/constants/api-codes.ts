export const API_CODES = {
  OK: "OK",
  AUTH_001: "AUTH_001",
  BALANCE_INSUFFICIENT: "BALANCE_INSUFFICIENT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

export type ApiResultCode = (typeof API_CODES)[keyof typeof API_CODES];
