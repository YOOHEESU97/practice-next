import { notFound } from "next/navigation";
import {
  findPageDefinition,
  type LnbSectionDefinition,
  type ReportPageDefinition,
} from "@/src/features/portal/report-definitions";
import { ReportFilterPage } from "@/src/features/portal/ReportFilterPage";

interface PortalPageProps {
  params: Promise<{ section: string; pageId: string }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { section, pageId } = await params;
  const found = findPageDefinition(section, pageId);

  if (!found) {
    notFound();
  }

  const matchedSection: LnbSectionDefinition = found.section;
  const matchedPage: ReportPageDefinition = found.page;

  return (
    <ReportFilterPage
      key={`${matchedSection.slug}-${matchedPage.slug}`}
      sectionTitle={matchedSection.title}
      pageTitle={matchedPage.title}
      filters={matchedPage.filters}
    />
  );
}
