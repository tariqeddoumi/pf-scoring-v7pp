import { Evaluation, EvaluationDomainScore } from "@prisma/client";
import { Badge, Card, SectionTitle } from "@/components/ui";

type Props = {
  evaluation: Evaluation & {
    domainScores: EvaluationDomainScore[];
  };
};

export function ScoreBreakdown({ evaluation }: Props) {
  return (
    <Card className="p-6">
      <SectionTitle title="Détail du scoring" subtitle="Vision par domaine et flags." />
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Domaine</th>
              <th>Poids</th>
              <th>Score brut</th>
              <th>Score pondéré</th>
              <th>Red flag</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.domainScores.map((score) => (
              <tr key={score.id}>
                <td className="font-semibold">{score.domainName}</td>
                <td>{(Number(score.weight) * 100).toFixed(0)}%</td>
                <td>{Number(score.rawScore).toFixed(1)}</td>
                <td>{Number(score.weightedScore).toFixed(1)}</td>
                <td>
                  {score.redFlag ? <Badge tone="warning">Oui</Badge> : <Badge tone="success">Non</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
