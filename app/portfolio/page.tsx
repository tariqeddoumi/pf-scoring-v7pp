import { prisma } from "@/lib/prisma";
import { Card, SectionTitle, Badge } from "@/components/ui";

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    include: {
      evaluations: {
        orderBy: { evaluationDate: "desc" },
        take: 1
      }
    }
  });

  const rows = projects.map((project) => ({
    project,
    last: project.evaluations[0]
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle title="Pilotage portefeuille" subtitle="Vision consolidée du portefeuille PF." />
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Projet</th>
                <th>Type</th>
                <th>Ville</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ project, last }) => (
                <tr key={project.id}>
                  <td className="font-semibold">{project.projectName}</td>
                  <td>{project.projectType}</td>
                  <td>{project.city}</td>
                  <td>{last ? last.finalScore.toFixed(1) : "-"}</td>
                  <td>{last ? last.finalGrade : "-"}</td>
                  <td>
                    {last ? (
                      <Badge tone={last.approved ? "success" : "warning"}>
                        {last.approved ? "Approuvable" : "Sous surveillance"}
                      </Badge>
                    ) : (
                      <Badge>Aucun score</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>Aucune donnée.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
