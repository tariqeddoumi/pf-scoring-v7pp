import { prisma } from "@/lib/prisma";
import { EvaluationForm } from "@/components/forms/evaluation-form";
import { Card, SectionTitle } from "@/components/ui";

export default async function NewEvaluationPage() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      projectCode: true,
      projectName: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle
          title="Nouvelle évaluation"
          subtitle="Saisie des critères, calcul automatique, sauvegarde et audit."
        />
        <EvaluationForm projects={projects} />
      </Card>
    </div>
  );
}
