import { Card, SectionTitle } from "@/components/ui";
import { classificationAdjustment, domainWeights } from "@/lib/scoring";

export default function ParametersPage() {
  const domains = [
    ["SPONSOR", "Sponsor & environnement"],
    ["PROJECT", "Maturité du projet"],
    ["CONSTRUCTION", "Construction"],
    ["OPERATIONS", "Opérations"],
    ["MARKET", "Marché & revenus"],
    ["LEGAL", "Cadre juridique"],
    ["FINANCIAL", "Structure financière"],
    ["ESG", "ESG & résilience"]
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle title="Paramètres de scoring" subtitle="Pondérations par domaine" />
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Domaine</th>
              <th>Poids</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(([code, label]) => (
              <tr key={code}>
                <td>{code}</td>
                <td>{label}</td>
                <td>{(domainWeights[code] * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Ajustement BAM" subtitle="Coefficient appliqué au pré-score" />
        <table className="table">
          <thead>
            <tr>
              <th>Classification</th>
              <th>Coefficient</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(classificationAdjustment).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
