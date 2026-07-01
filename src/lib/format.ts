export const fmtSAR = (n: number) => {
  const abs = Math.abs(n);
  const s = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return `${n < 0 ? "-" : ""}${s}`;
};

export const fmtNum = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
};

export const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
};

export function burnoutTier(score: number) {
  if (score < 35) return { label: "منخفض", color: "success", tone: "أنت في منطقة آمنة" };
  if (score < 60) return { label: "متوسط", color: "warning", tone: "انتبه لبعض العادات" };
  if (score < 80) return { label: "مرتفع", color: "warning", tone: "قد تواجه ضغطاً مالياً قريباً" };
  return { label: "خطر", color: "danger", tone: "نوصي بتفعيل وضع التعافي" };
}
