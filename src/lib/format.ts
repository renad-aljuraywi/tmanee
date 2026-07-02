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

export type BurnoutLabel = "Healthy" | "At Risk" | "Burnout";

export function tierFromLabel(label: BurnoutLabel) {
  if (label === "Healthy")
    return {
      label: "سليم مالياً",
      color: "success" as const,
      tone: "وضعك المالي مستقر ونمطك صحي",
      hint: "استمر على نفس العادات وحافظ على معدل الادّخار الحالي.",
      advice: "خصّص جزءاً بسيطاً إضافياً للاستثمار طويل المدى — نمطك يسمح بذلك.",
    };
  if (label === "At Risk")
    return {
      label: "معرّض للاستنزاف",
      color: "warning" as const,
      tone: "النموذج رصد إشارات ضغط مالي مبكّرة",
      hint: "إذا استمر هذا النمط قد تدخل مرحلة الاستنزاف قبل نهاية الشهر.",
      advice: "قلّل المصاريف المتغيّرة (ترفيه ومطاعم) لأسبوع، وسترى تحسّناً في المؤشر خلال 3 أيام.",
    };
  return {
    label: "استنزاف مالي",
    color: "danger" as const,
    tone: "النموذج يصنّف نمطك ضمن حالة الاستنزاف",
    hint: "الإنفاق يفوق قدرتك المستدامة — يُنصح بتفعيل وضع التعافي فوراً.",
    advice: "جمّد الفئات غير الأساسية مؤقتاً وأعد ترتيب الأولويات مع منيع.",
  };
}

export function reasonsFromLabel(label: BurnoutLabel) {
  if (label === "Healthy")
    return [
      { icon: "piggy", label: "التزامك بحدود الميزانية", delta: "ممتاز" },
      { icon: "food", label: "إنفاق متزن على المطاعم", delta: "ضمن الحد" },
      { icon: "shop", label: "عدد عمليات الشراء الصغيرة", delta: "منخفض" },
      { icon: "cal", label: "الاعتماد على الشراء المؤجّل", delta: "0 عمليات" },
    ];
  if (label === "At Risk")
    return [
      { icon: "food", label: "زيادة الإنفاق على المطاعم", delta: "+22%" },
      { icon: "piggy", label: "تراجع في الادّخار", delta: "-25%" },
      { icon: "shop", label: "كثرة عمليات الشراء الصغيرة", delta: "+12" },
      { icon: "cal", label: "بداية الاعتماد على الشراء المؤجّل", delta: "+2 عمليات" },
    ];
  return [
    { icon: "food", label: "إنفاق مرتفع جداً على المطاعم", delta: "+48%" },
    { icon: "piggy", label: "توقّف شبه كامل للادّخار", delta: "-80%" },
    { icon: "shop", label: "تكرار عمليات شراء متسارعة", delta: "+34" },
    { icon: "cal", label: "اعتماد كبير على الشراء المؤجّل", delta: "+7 عمليات" },
  ];
}
