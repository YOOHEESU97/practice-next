import { PortalShell } from "@/src/features/portal/PortalShell";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PortalShell>{children}</PortalShell>;
}
