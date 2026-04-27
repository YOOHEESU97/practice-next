import { AccountList } from "@/src/features/accounts/AccountList";
import { SimpleTransferForm } from "@/src/features/transfer/SimpleTransferForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--color-canvas)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            practice-next
          </h1>
          <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
            공통 레이어·UI·기능 단위 컴포넌트 연습 보드입니다.
          </p>
        </header>
        <AccountList />
        <SimpleTransferForm />
      </div>
    </div>
  );
}
