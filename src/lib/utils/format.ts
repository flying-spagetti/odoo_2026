export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPaiseAsRupees(paise: number | null | undefined): string {
  if (paise === null || paise === undefined) {
    return "—";
  }

  return `₹${formatIndianCurrency(paise / 100)}`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatOdometer(km: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(km);
}
