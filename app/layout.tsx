import "./globals.css";
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { PageShell } from "@/components/ui";

export const metadata = {
  title: "PF Scoring Studio V7++",
  description: "Plateforme de scoring project finance V7++"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <PageShell>
          <div className="flex gap-6">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </PageShell>
      </body>
    </html>
  );
}
