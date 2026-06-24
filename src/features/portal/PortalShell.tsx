"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LNB_SECTIONS } from "@/src/features/portal/report-definitions";
import { cn } from "@/src/lib/cn";

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)]">
      <aside className="sticky top-0 h-screen w-80 shrink-0 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h1 className="text-base font-semibold">상담/리포트 포털</h1>
          <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
            LNB 기준 공통 조회조건 화면
          </p>
        </div>

        <nav className="space-y-1 p-4">
          {LNB_SECTIONS.map((section) => (
            <div key={section.slug} className="rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <div className="border-b border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm font-semibold">
                {section.title}
              </div>
              <ul className="space-y-1 p-2">
                {section.pages.map((page) => {
                  const href = `/${section.slug}/${page.slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={page.slug}>
                      <Link
                        href={href}
                        className={cn(
                          "block rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-[var(--color-brand)] text-[var(--color-brand-fg)]"
                            : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                        )}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
