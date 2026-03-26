import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { ScoreBreakdown } from "@/components/score-breakdown";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      evaluations: {
        orderBy: { evaluationDate: "desc" },
        include: {
          domainScores: true
        }
      }
    }
  });

  if (!project) notFound();

  const latest = project.evaluations[0];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle
          title={project.projectName}
          subtitle={`${project.projectCode} • ${project.city} • ${project.projectType}`}
          action={
            <Link href="/evaluations/new" className="btn btn-primary">
              Nouvelle évaluation
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="kpi">
            <div className="text-sm text-slate-500">Sponsor</div>
            <div className="mt-2 font-bold">{project.sponsorName || "-"}</div>
          </div>
          <div className="kpi">
            <div className="text-sm text-slate-500">Dette demandée</div>
            <div className="mt-2 font-bold">{formatCurrency(Number(project.requestedDebtMad))}</div>
          </div>
          <div className="kpi">
            <div className="text-sm text-slate-500">Fonds propres</div>
            <div className="mt-2 font-bold">{formatCurrency(Number(project.equityMad))}</div>
          </div>
          <div className="kpi">
            <div className="text-sm text-slate-500">Statut actuel</div>
            <div className="mt-2">
              {latest ? (
                <Badge tone={latest.approved ? "success" : "warning"}>
                  {latest.finalGrade} • {latest.finalScore.toFixed(1)}
                </Badge>
              ) : (
                <Badge>Aucune note</Badge>
              )}
            </div>
          </div>
        </div>

        {project.description ? (
          <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            {project.description}
          </div>
        ) : null}
      </Card>

      {latest ? <ScoreBreakdown evaluation={latest} /> : null}

      <Card className="p-6">
        <SectionTitle title="Historique des évaluations" subtitle="Traçabilité complète." />
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Pré-score</th>
                <th>Classification BAM</th>
                <th>Décision</th>
                <th>Commentaires</th>
              </tr>
            </thead>
            <tbody>
              {project.evaluations.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>{new Date(evaluation.evaluationDate).toLocaleDateString("fr-MA")}</td>
                  <td>{evaluation.finalScore.toFixed(1)}</td>
                  <td>{evaluation.finalGrade}</td>
                  <td>{evaluation.preAdjustmentScore.toFixed(1)}</td>
                  <td>{evaluation.classificationBam}</td>
                  <td>
                    <Badge tone={evaluation.approved ? "success" : "danger"}>
                      {evaluation.approved ? "Approuvable" : "Réexamen"}
                    </Badge>
                  </td>
                  <td className="max-w-md">{evaluation.commentary || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
