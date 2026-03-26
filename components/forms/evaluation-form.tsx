"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { computeScore } from "@/lib/scoring";

type Project = {
  id: string;
  projectCode: string;
  projectName: string;
};

const defaults = {
  projectId: "",
  countryRisk: 30,
  sponsorTrackRecord: 75,
  sponsorFinancialStrength: 70,
  technicalMaturity: 65,
  permitStatus: 60,
  constructionComplexity: 45,
  contractorStrength: 70,
  omStrength: 70,
  offtakerStrength: 65,
  contractCoverage: 60,
  priceVolatility: 40,
  dscrBase: 1.3,
  dscrStress: 1.1,
  gearing: 65,
  reserveMonths: 6,
  legalRobustness: 65,
  esgClimateResilience: 60,
  classificationBam: "HEALTHY"
};

export function EvaluationForm({ projects }: { projects: Project[] }) {
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const result = useMemo(() => computeScore(form), [form]);

  async function submit() {
    setSaving(true);
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setSaving(false);
    if (!response.ok) {
      alert("Erreur lors de l'enregistrement de l'évaluation.");
      return;
    }

    const data = await response.json();
    router.push(`/projects/${data.projectId}`);
    router.refresh();
  }

  const numberFields = [
    ["Risque pays", "countryRisk"],
    ["Track record sponsor", "sponsorTrackRecord"],
    ["Solidité financière sponsor", "sponsorFinancialStrength"],
    ["Maturité technique", "technicalMaturity"],
    ["Permis / autorisations", "permitStatus"],
    ["Complexité construction", "constructionComplexity"],
    ["Force EPC / contractors", "contractorStrength"],
    ["Qualité O&M", "omStrength"],
    ["Solidité offtaker", "offtakerStrength"],
    ["Couverture contractuelle", "contractCoverage"],
    ["Volatilité de prix", "priceVolatility"],
    ["DSCR base", "dscrBase"],
    ["DSCR stress", "dscrStress"],
    ["Gearing (%)", "gearing"],
    ["DSRA / réserves (mois)", "reserveMonths"],
    ["Robustesse juridique", "legalRobustness"],
    ["ESG & résilience climatique", "esgClimateResilience"]
  ] as const;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <span>Projet</span>
            <select
              className="select"
              value={form.projectId}
              onChange={(e) => setForm((s) => ({ ...s, projectId: e.target.value }))}
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectCode} — {project.projectName}
                </option>
              ))}
            </select>
          </label>

          {numberFields.map(([label, key]) => (
            <label key={key} className="space-y-2 text-sm font-semibold text-slate-700">
              <span>{label}</span>
              <input
                className="input"
                type="number"
                step={key.includes("dscr") ? "0.01" : "1"}
                value={form[key]}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    [key]: Number(e.target.value)
                  }))
                }
              />
            </label>
          ))}

          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <span>Classification BAM</span>
            <select
              className="select"
              value={form.classificationBam}
              onChange={(e) => setForm((s) => ({ ...s, classificationBam: e.target.value as typeof s.classificationBam }))}
            >
              {["HEALTHY", "WATCH", "SENSITIVE", "SUBSTANDARD", "DOUBTFUL", "LOSS"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <button disabled={saving || !form.projectId} onClick={submit} className="btn btn-primary">
              {saving ? "Enregistrement..." : "Enregistrer l'évaluation"}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="text-lg font-bold">Prévisualisation du score</div>
        <div className="mt-4 text-sm text-slate-500">
          Recalcul instantané avant sauvegarde, avec domaines pondérés et hard stops.
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pré-score</div>
            <div className="mt-2 text-3xl font-bold">{result.preAdjustment}</div>
          </div>
          <div className="rounded-2xl bg-teal-50 p-4">
            <div className="text-xs uppercase tracking-wide text-teal-700">Score final</div>
            <div className="mt-2 text-3xl font-bold text-teal-800">{result.finalScore}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <div className="font-semibold">
            Grade {result.grade.grade} — {result.grade.label}
          </div>
          <div className="mt-1 text-sm text-slate-500">{result.grade.outlook}</div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-500">Domaines</div>
          <div className="mt-3 space-y-3">
            {result.domains.map((domain) => (
              <div key={domain.code} className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{domain.name}</div>
                    <div className="text-xs text-slate-500">Poids: {(domain.weight * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{domain.rawScore.toFixed(1)}</div>
                    <div className="text-xs text-slate-500">pondéré {domain.weightedScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.hardStops.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-bold">Hard stops</div>
            <ul className="mt-2 list-disc pl-5">
              {result.hardStops.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
