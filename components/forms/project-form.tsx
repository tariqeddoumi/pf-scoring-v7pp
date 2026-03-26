"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  projectCode: "",
  projectName: "",
  clientRadical: "",
  city: "",
  country: "Maroc",
  projectType: "Énergie",
  currency: "MAD",
  totalCostMad: "",
  requestedDebtMad: "",
  equityMad: "",
  sponsorName: "",
  offtakerName: "",
  epcName: "",
  omOperatorName: "",
  stage: "Développement",
  description: ""
};

export function ProjectForm() {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function submit() {
    setSaving(true);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        totalCostMad: Number(form.totalCostMad),
        requestedDebtMad: Number(form.requestedDebtMad),
        equityMad: Number(form.equityMad)
      })
    });
    setSaving(false);

    if (!response.ok) {
      alert("Erreur lors de la création du projet.");
      return;
    }

    const data = await response.json();
    router.push(`/projects/${data.id}`);
    router.refresh();
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        ["Code projet", "projectCode"],
        ["Nom du projet", "projectName"],
        ["Radical client", "clientRadical"],
        ["Ville", "city"],
        ["Pays", "country"],
        ["Type de projet", "projectType"],
        ["Devise", "currency"],
        ["Sponsor", "sponsorName"],
        ["Offtaker principal", "offtakerName"],
        ["EPC principal", "epcName"],
        ["Opérateur O&M", "omOperatorName"],
        ["Phase du projet", "stage"]
      ].map(([label, key]) => (
        <label key={key} className="space-y-2 text-sm font-semibold text-slate-700">
          <span>{label}</span>
          <input
            className="input"
            value={(form as Record<string, string>)[key]}
            onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
          />
        </label>
      ))}

      <label className="space-y-2 text-sm font-semibold text-slate-700">
        <span>Coût total (MAD)</span>
        <input
          className="input"
          type="number"
          value={form.totalCostMad}
          onChange={(e) => setForm((s) => ({ ...s, totalCostMad: e.target.value }))}
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-slate-700">
        <span>Dette demandée (MAD)</span>
        <input
          className="input"
          type="number"
          value={form.requestedDebtMad}
          onChange={(e) => setForm((s) => ({ ...s, requestedDebtMad: e.target.value }))}
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
        <span>Fonds propres (MAD)</span>
        <input
          className="input"
          type="number"
          value={form.equityMad}
          onChange={(e) => setForm((s) => ({ ...s, equityMad: e.target.value }))}
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
        <span>Description</span>
        <textarea
          className="textarea min-h-32"
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
        />
      </label>

      <div className="md:col-span-2">
        <button disabled={saving} onClick={submit} className="btn btn-primary">
          {saving ? "Enregistrement..." : "Créer le projet"}
        </button>
      </div>
    </div>
  );
}
