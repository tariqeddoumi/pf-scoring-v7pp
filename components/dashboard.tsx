import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge, Card, SectionTitle } from "@/components/ui";

export async function Dashboard() {
  const [projectCount, evaluationCount, lastEvaluations, avgScoreResult, totalCostResult] =
    await Promise.all([
      prisma.project.count(),
      prisma.evaluation.count(),
      prisma.evaluation.findMany({
        orderBy: { evaluationDate: "desc" },
        include: { project: true },
        take: 5
      }),
      prisma.evaluation.aggregate({ _avg: { finalScore: true } }),
      prisma.project.aggregate({ _sum: { totalCostMad: true } })
    ]);

  const averageScore = avgScoreResult._avg.finalScore ?? 0;
  const totalCostMad = totalCostResult._sum.totalCostMad ?? 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Cockpit V7++"
        subtitle="Suivi instantané des projets, des notations et des alertes."
        action={
          <Link href="/evaluations/new" className="btn btn-primary">
            Nouvelle évaluation
            <ArrowRight size={16} />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="kpi">
          <div className="text-sm text-slate-500">Nombre de projets</div>
          <div className="mt-2 text-3xl font-bold">{projectCount}</div>
        </div>
        <div className="kpi">
          <div className="text-sm text-slate-500">Évaluations réalisées</div>
          <div className="mt-2 text-3xl font-bold">{evaluationCount}</div>
        </div>
        <div className="kpi">
          <div className="text-sm text-slate-500">Score moyen</div>
          <div className="mt-2 text-3xl font-bold">{averageScore.toFixed(1)}/100</div>
        </div>
        <div className="kpi">
          <div className="text-sm text-slate-500">Coût total des projets</div>
          <div className="mt-2 text-3xl font-bold">{formatCurrency(Number(totalCostMad))}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <SectionTitle
            title="Dernières évaluations"
            subtitle="Les notations les plus récentes avec statut rapide."
          />
          <div className="overflow-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Décision</th>
                </tr>
              </thead>
              <tbody>
                {lastEvaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>
                      <Link className="font-semibold text-teal-800" href={`/projects/${evaluation.projectId}`}>
                        {evaluation.project.projectName}
                      </Link>
                    </td>
                    <td>{new Date(evaluation.evaluationDate).toLocaleDateString("fr-MA")}</td>
                    <td>{evaluation.finalScore.toFixed(1)}</td>
                    <td>{evaluation.finalGrade}</td>
                    <td>
                      <Badge tone={evaluation.approved ? "success" : "danger"}>
                        {evaluation.approved ? "Approuvable" : "Vigilance"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {lastEvaluations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-slate-500">
                      Aucune donnée pour le moment.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Logique de décision" subtitle="Résumé de la mécanique V7++" />
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldCheck size={16} /> Score final
              </div>
              <p className="mt-2">
                Le score agrège 8 domaines avec pondérations, puis applique un ajustement réglementaire BAM.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle size={16} /> Hard stops
              </div>
              <p className="mt-2">
                Un DSCR stress insuffisant, des permis non sécurisés ou une contrepartie d'achat trop fragile bloquent la recommandation.
              </p>
            </div>
            <Link href="/sql" className="inline-flex font-semibold text-teal-700">
              Voir le script SQL et l'architecture
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
