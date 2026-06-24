"use client";

import { useMemo, useState } from "react";
import type {
  CheckboxFilterDefinition,
  DatePrecision,
  DatePresetKey,
  FilterDefinition,
} from "@/src/features/portal/report-definitions";
import { Button } from "@/src/ui/button";
import { Input } from "@/src/ui/input";

interface ReportFilterPageProps {
  sectionTitle: string;
  pageTitle: string;
  filters: FilterDefinition[];
}

interface DateRangeValue {
  start: string;
  end: string;
  selectedPreset: DatePresetKey | "custom";
}

type FilterValue = string | string[] | DateRangeValue;
type FilterValues = Record<string, FilterValue>;

const PRESET_DESCRIPTIONS: Record<DatePresetKey | "custom", string> = {
  custom: "사용자 지정",
  "direct-input": "직접입력",
  "last-7-days": "최근 7일",
  "last-month": "전월",
  "two-months-ago": "전전월",
  "three-months-ago": "3개월전",
  "this-year": "금년",
  "last-year": "작년",
  "two-years-ago": "재작년",
};

function formatDay(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonth(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

function formatYear(date: Date) {
  return `${date.getFullYear()}`;
}

function monthWindow(base: Date, offset: number) {
  const firstDay = new Date(base.getFullYear(), base.getMonth() - offset, 1);
  const lastDay = new Date(base.getFullYear(), base.getMonth() - offset + 1, 0);
  return { firstDay, lastDay };
}

function toRangeString(precision: DatePrecision, startDate: Date, endDate: Date) {
  if (precision === "day") {
    return { start: formatDay(startDate), end: formatDay(endDate) };
  }

  if (precision === "month") {
    return { start: formatMonth(startDate), end: formatMonth(endDate) };
  }

  return { start: formatYear(startDate), end: formatYear(endDate) };
}

function computeRangeByPreset(
  preset: DatePresetKey,
  precision: DatePrecision,
): Pick<DateRangeValue, "start" | "end"> | null {
  const now = new Date();

  if (preset === "direct-input") return null;

  if (preset === "last-7-days") {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    return toRangeString(precision, startDate, now);
  }

  if (preset === "this-year") {
    return { start: `${now.getFullYear()}`, end: `${now.getFullYear()}` };
  }

  if (preset === "last-year") {
    return {
      start: `${now.getFullYear() - 1}`,
      end: `${now.getFullYear() - 1}`,
    };
  }

  if (preset === "two-years-ago") {
    return {
      start: `${now.getFullYear() - 2}`,
      end: `${now.getFullYear() - 2}`,
    };
  }

  if (
    preset === "last-month" ||
    preset === "two-months-ago" ||
    preset === "three-months-ago"
  ) {
    const offset = preset === "last-month" ? 1 : preset === "two-months-ago" ? 2 : 3;
    const { firstDay, lastDay } = monthWindow(now, offset);
    return toRangeString(precision, firstDay, lastDay);
  }

  return null;
}

function normalizeCheckboxSelection(
  filter: CheckboxFilterDefinition,
  selection: string[],
) {
  const lockValues = new Set(filter.lockValues ?? []);
  const hasLockedValues = lockValues.size > 0;
  const hasAllOption = filter.options.includes("전체");

  if (hasLockedValues) {
    // "해제 불가 + 전체 선택" 규칙: 고정값만 선택 유지, 나머지는 비활성.
    return filter.options.filter((option) => lockValues.has(option));
  }

  const set = new Set(selection);
  const normalOptions = filter.options.filter((option) => option !== "전체");

  if (hasAllOption) {
    if (set.has("전체")) {
      filter.options.forEach((option) => set.add(option));
    } else {
      const isAllNormalSelected =
        normalOptions.length > 0 &&
        normalOptions.every((option) => set.has(option));
      if (isAllNormalSelected) {
        set.add("전체");
      } else {
        set.delete("전체");
      }
    }
  }

  return filter.options.filter((option) => set.has(option));
}

function createInitialValues(filters: FilterDefinition[]): FilterValues {
  const initialEntries = filters.map<[string, FilterValue]>((filter) => {
    if (filter.type === "date-range") {
      const firstPreset = filter.presets[0]?.key ?? "direct-input";
      const computed = computeRangeByPreset(firstPreset, filter.precision);
      return [
        filter.id,
        {
          start: computed?.start ?? "",
          end: computed?.end ?? "",
          selectedPreset: firstPreset,
        },
      ];
    }

    if (filter.type === "select") {
      return [filter.id, filter.options[0] ?? ""];
    }

    if (filter.type === "checkbox") {
      const selected = normalizeCheckboxSelection(filter, [...filter.options]);
      return [filter.id, selected];
    }

    return [filter.id, ""];
  });

  return Object.fromEntries(initialEntries);
}

function precisionInputType(precision: DatePrecision) {
  if (precision === "day") return "date";
  if (precision === "month") return "month";
  return "number";
}

function precisionHint(precision: DatePrecision) {
  if (precision === "day") return "년/월/일 입력";
  if (precision === "month") return "년/월 입력";
  return "년 입력";
}

function isDateRangeValue(value: FilterValue): value is DateRangeValue {
  return typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: FilterValue): value is string[] {
  return Array.isArray(value);
}

function toDateRangeValue(value: FilterValue): DateRangeValue {
  if (isDateRangeValue(value)) return value;
  return { start: "", end: "", selectedPreset: "custom" };
}

export function ReportFilterPage({
  sectionTitle,
  pageTitle,
  filters,
}: ReportFilterPageProps) {
  const [values, setValues] = useState<FilterValues>(() => createInitialValues(filters));
  const [lastSubmitted, setLastSubmitted] = useState<FilterValues | null>(null);

  const filterCount = filters.length;
  const serializableValues = useMemo(
    () => JSON.stringify(lastSubmitted ?? values, null, 2),
    [lastSubmitted, values],
  );

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-foreground-muted)]">
            {sectionTitle}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{pageTitle}</h2>
          <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
            공통 필터 컴포넌트를 재사용해 조회조건 UI를 구성했습니다. (필터 개수:{" "}
            {filterCount}개)
          </p>
        </header>

        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              setLastSubmitted(values);
            }}
          >
            {filters.map((filter) => {
              const currentValue = values[filter.id];
              const dateValue = toDateRangeValue(currentValue);

              return (
                <div
                  key={filter.id}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
                >
                  <label className="block text-sm font-semibold">{filter.label}</label>

                  {filter.type === "date-range" ? (
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {filter.presets.map((preset) => {
                          const selected = dateValue.selectedPreset === preset.key;

                          return (
                            <button
                              key={preset.key}
                              type="button"
                              className={`rounded-[var(--radius-md)] border px-3 py-1.5 text-xs transition-colors ${
                                selected
                                  ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-fg)]"
                                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)]"
                              }`}
                              onClick={() => {
                                const computed = computeRangeByPreset(
                                  preset.key,
                                  filter.precision,
                                );

                                setValues((prev) => {
                                  const before = prev[filter.id];
                                  if (!isDateRangeValue(before)) return prev;

                                  return {
                                    ...prev,
                                    [filter.id]: {
                                      start: computed?.start ?? before.start,
                                      end: computed?.end ?? before.end,
                                      selectedPreset: preset.key,
                                    },
                                  };
                                });
                              }}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          type={precisionInputType(filter.precision)}
                          value={dateValue.start}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setValues((prev) => {
                              const before = prev[filter.id];
                              if (!isDateRangeValue(before)) return prev;

                              return {
                                ...prev,
                                [filter.id]: {
                                  ...before,
                                  start: nextValue,
                                  selectedPreset: "custom",
                                },
                              };
                            });
                          }}
                          placeholder="시작"
                        />
                        <Input
                          type={precisionInputType(filter.precision)}
                          value={dateValue.end}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setValues((prev) => {
                              const before = prev[filter.id];
                              if (!isDateRangeValue(before)) return prev;

                              return {
                                ...prev,
                                [filter.id]: {
                                  ...before,
                                  end: nextValue,
                                  selectedPreset: "custom",
                                },
                              };
                            });
                          }}
                          placeholder="종료"
                        />
                      </div>

                      <p className="text-xs text-[var(--color-foreground-muted)]">
                        {precisionHint(filter.precision)} / 현재 프리셋:{" "}
                        {PRESET_DESCRIPTIONS[dateValue.selectedPreset]}
                      </p>
                    </div>
                  ) : null}

                  {filter.type === "select" ? (
                    <div className="mt-3">
                      <select
                        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-brand)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/25"
                        value={typeof currentValue === "string" ? currentValue : ""}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setValues((prev) => ({ ...prev, [filter.id]: nextValue }));
                        }}
                      >
                        {filter.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {filter.type === "checkbox" ? (
                    <div className="mt-3 space-y-3">
                      {filter.enableSelectAll &&
                      (filter.lockValues ?? []).length === 0 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="text-xs"
                          onClick={() => {
                            const selected = isStringArray(currentValue)
                              ? currentValue
                              : [];
                            const isAllSelected = filter.options.every((option) =>
                              selected.includes(option),
                            );
                            const nextValues = isAllSelected ? [] : [...filter.options];

                            setValues((prev) => ({
                              ...prev,
                              [filter.id]: normalizeCheckboxSelection(filter, nextValues),
                            }));
                          }}
                        >
                          전체 선택/해제
                        </Button>
                      ) : null}

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {filter.options.map((option) => {
                          const selected = isStringArray(currentValue) ? currentValue : [];
                          const checked = selected.includes(option);
                          const isLocked = (filter.lockValues ?? []).includes(option);
                          const hasLockedValues = (filter.lockValues ?? []).length > 0;
                          const disabledBecauseLockedGroup = hasLockedValues && !isLocked;

                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm ${
                                disabledBecauseLockedGroup
                                  ? "opacity-60"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="size-4 accent-[var(--color-brand)]"
                                checked={checked}
                                disabled={
                                  (isLocked && checked) || disabledBecauseLockedGroup
                                }
                                onChange={() => {
                                  setValues((prev) => {
                                    const before = prev[filter.id];
                                    const selectedValues = isStringArray(before)
                                      ? [...before]
                                      : [];

                                    let nextValues = selectedValues;
                                  const hasLockedValues =
                                    (filter.lockValues ?? []).length > 0;
                                  const hasAllOption =
                                    filter.options.includes("전체");

                                  if (!hasLockedValues && hasAllOption && option === "전체") {
                                    const isAllSelected = filter.options.every((item) =>
                                      selectedValues.includes(item),
                                    );
                                    nextValues = isAllSelected
                                      ? []
                                      : [...filter.options];
                                    } else {
                                    if (selectedValues.includes(option)) {
                                      nextValues = selectedValues.filter(
                                        (item) => item !== option,
                                      );
                                    } else {
                                      nextValues = [...selectedValues, option];
                                    }
                                    }

                                    return {
                                      ...prev,
                                      [filter.id]: normalizeCheckboxSelection(
                                        filter,
                                        nextValues,
                                      ),
                                    };
                                  });
                                }}
                              />
                              <span>{option}</span>
                              {isLocked || disabledBecauseLockedGroup ? (
                                <span className="ml-auto text-xs text-[var(--color-foreground-muted)]">
                                  {isLocked ? "해제불가" : "선택불가"}
                                </span>
                              ) : null}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {filter.type === "text" ? (
                    <div className="mt-3">
                      <Input
                        value={typeof currentValue === "string" ? currentValue : ""}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setValues((prev) => ({ ...prev, [filter.id]: nextValue }));
                        }}
                        placeholder={filter.placeholder ?? `${filter.label} 입력`}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2">
              <Button type="submit">조회 조건 적용</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setValues(createInitialValues(filters));
                  setLastSubmitted(null);
                }}
              >
                초기화
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="text-base font-semibold">조회 파라미터 미리보기</h3>
          <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
            실제 API 연동 전 공통 컴포넌트 바인딩 상태를 확인하기 위한 샘플 영역입니다.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-muted)] p-4 text-xs">
            {serializableValues}
          </pre>
        </section>
      </div>
    </div>
  );
}
