import { AdminPanel } from "@/components/AdminPanel";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Admin — KYIVHELP",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <PageShell>
      <AdminPanel />
    </PageShell>
  );
}
