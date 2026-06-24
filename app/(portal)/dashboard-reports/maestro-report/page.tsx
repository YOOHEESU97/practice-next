import { notFound } from "next/navigation";
import { ReportFilterPage } from "@/src/features/portal/ReportFilterPage";
import { findPageDefinition } from "@/src/features/portal/report-definitions";

/**
 * 마에스트로 리포트 정적 예시 페이지
 * - report-definitions 설정을 읽어와서 필터를 구성
 * - 퍼블리싱은 샘플 수준으로 단순 구성
 */
export default function MaestroReportExamplePage() {
  const found = findPageDefinition("dashboard-reports", "maestro-report");

  if (!found) {
    notFound();
  }

  return (
    <ReportFilterPage
      sectionTitle={found.section.title}
      pageTitle={`${found.page.title} (예시 페이지)`}
      filters={found.page.filters}
    />
  );
}
