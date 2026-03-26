import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { ProjectForm } from "@/components/forms/project-form";
import { formatCurrency } from "@/lib/utils";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      evaluations: {
        orderBy: { evaluationDate: "desc" },
        take: 1
      }
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle title="Créer un projet" subtitle="Signalétique projet V7++" />
        <ProjectForm />
      </Card>

      <Card className="p-6">
        <SectionTitle title="Portefeuille projets" subtitle="Liste consolidée des projets enregistrés" />
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Projet</th>
                <th>Ville</th>
                <th>Type</th>
                <th>Coût total</th>
                <th>Dernier score</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const last = project.evaluations[0];
                return (
                  <tr key={project.id}>
                    <td>{project.projectCode}</td>
                    <td>
                      <Link href={`/projects/${project.id}`} className="font-semibold text-teal-700">
                        {project.projectName}
                      </Link>
                    </td>
                    <td>{project.city}</td>
                    <td>{project.projectType}</td>
                    <td>{formatCurrency(Number(project.totalCostMad))}</td>
                    <td>
                      {last ? (
                        <Badge tone={last.approved ? "success" : "warning"}>
                          {last.finalScore.toFixed(1)} / {last.finalGrade}
                        </Badge>
                      ) : (
                        <Badge>Aucune évaluation</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-slate-500">
                    Aucun projet enregistré.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
