export const fmtSAR = (n: number) => {
  const abs = Math.abs(n);
  const s = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return `${n < 0 ? "-" : ""}${s}`;
};

export const fmtNum = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${AR_MONTHS[d.getUTCMonth()]}`;
};

export const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

export function burnoutTier(score: number) {
  if (score < 35) return { label: "منخفض", color: "success", tone: "أنت في منطقة آمنة" };
  if (score < 60) return { label: "متوسط", color: "warning", tone: "انتبه لبعض العادات" };
  if (score < 80) return { label: "مرتفع", color: "warning", tone: "قد تواجه ضغطاً مالياً قريباً" };
  return { label: "خطر", color: "danger", tone: "نوصي بتفعيل وضع التعافي" };
}
