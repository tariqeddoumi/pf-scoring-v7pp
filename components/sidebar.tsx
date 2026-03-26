import Link from "next/link";
import { BarChart3, Building2, ClipboardCheck, Database, Home, Settings2 } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Projets", icon: Building2 },
  { href: "/evaluations/new", label: "Nouvelle évaluation", icon: ClipboardCheck },
  { href: "/parameters", label: "Paramètres", icon: Settings2 },
  { href: "/sql", label: "SQL setup", icon: Database },
  { href: "/portfolio", label: "Portefeuille", icon: BarChart3 }
];

export function Sidebar() {
  return (
    <aside className="card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 p-4 lg:block">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">V7++</div>
        <div className="mt-2 text-xl font-bold">PF Scoring Studio</div>
        <p className="mt-1 text-sm text-slate-500">
          Version web premium pour scoring, portefeuille et audit.
        </p>
      </div>

      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">
        <div className="font-bold">Mode de déploiement conseillé</div>
        <p className="mt-2">
          GitHub → Vercel pour le front, PostgreSQL pour la base, Prisma pour les migrations.
        </p>
      </div>
    </aside>
  );
}
