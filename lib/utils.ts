export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value: number | null | undefined, maximumFractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits
  }).format(value);
}

export function formatCurrency(value: number | null | undefined, currency = "MAD") {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-700";
  if (score >= 65) return "text-teal-700";
  if (score >= 50) return "text-amber-700";
  return "text-red-700";
}
