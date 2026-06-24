import { redirect } from "next/navigation";
import { getDefaultRoutePath } from "@/src/features/portal/report-definitions";

export default function Home() {
  redirect(getDefaultRoutePath());
}
