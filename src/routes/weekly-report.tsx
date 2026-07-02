import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { fetchSample, type SamplePayload } from "@/lib/ai";
import { tierFromLabel } from "@/lib/format";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/weekly-report")({ component: WeeklyReport });

const DAYS = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];

function WeeklyReport() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [sample, setSample] = useState<SamplePayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSample().then((s) => { if (alive) setSample(s); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // Take last 7 timesteps, feature 0 = daily spend
  const week = useMemo(() => {
    if (!sample) return [] as number[];
    const rows = sample.session.slice(-7);
    return rows.map((r) => Math.round(r[0]));
  }, [sample]);

  const total = week.reduce((a, b) => a + b, 0);
  const weekMax = Math.max(1, ...week);
  const peakIdx = week.indexOf(weekMax);
  const avg = week.length ? Math.round(total / week.length) : 0;

  const pred = sample?.prediction;
  const tier = pred ? tierFromLabel(pred.prediction) : null;
  const topProb = pred ? Math.round((pred.probabilities[pred.prediction] ?? 0) * 100) : 0;

  const SLIDES = useMemo(() => {
    if (!sample || !pred || !tier) return [] as any[];
    const best = Math.min(...week);
    const worst = Math.max(...week);
    return [
      {
        kind: "chart",
        bg: "linear-gradient(135deg,#4F46E5,#7C3AED)",
        title: "هذا الأسبوع",
        big: total.toLocaleString("en-US"),
        sub: "ريال أنفقتها",
        note: `المتوسط اليومي ${avg} ر.س`,
      },
      {
        kind: "stat",
        bg: "linear-gradient(135deg,#059669,#10B981)",
        emoji: "📈",
        title: "أقل يوم إنفاقاً",
        big: best.toLocaleString("en-US"),
        sub: "ريال في يومك الأفضل",
        note: `أقل بـ ${Math.max(0, worst - best)} ر.س عن أعلى يوم`,
      },
      {
        kind: "stat",
        bg: "linear-gradient(135deg,#F97316,#EA580C)",
        emoji: "🍔",
        title: "أعلى يوم إنفاقاً",
        big: worst.toLocaleString("en-US"),
        sub: "ريال في يومك الأكثر استنزافاً",
        note: `${DAYS[peakIdx]} تحديداً`,
      },
      {
        kind: "model",
        bg: "linear-gradient(135deg,#0EA5E9,#0284C7)",
        emoji: "🔮",
        title: "تصنيف النموذج",
        big: `${topProb}%`,
        sub: tier.label,
        note: tier.hint,
      },
      {
        kind: "stat",
        bg: "linear-gradient(135deg,#EC4899,#DB2777)",
        emoji: "💡",
        title: "نصيحة منيع",
        big: "→",
        sub: tier.advice,
        note: "افتحها في منيع",
      },
    ];
  }, [sample, pred, tier, total, avg, week, peakIdx]);

  const s = SLIDES[i];
  const next = () => (i < SLIDES.length - 1 ? setI(i + 1) : nav({ to: "/home" }));

  if (!sample || !s) {
    return (
      <div className="grid min-h-dvh place-items-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-xs opacity-70">جارٍ تحضير التقرير من النموذج…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 top-3 z-20 flex gap-1 px-3">
        {SLIDES.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            {idx < i && <div className="h-full w-full bg-white" />}
            {idx === i && (
              <motion.div key={i} className="h-full bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} onAnimationComplete={next} />
            )}
          </div>
        ))}
      </div>
      <button className="absolute top-6 left-4 z-20 text-xs opacity-80" onClick={() => nav({ to: "/home" })}>إغلاق ✕</button>

      <button className="absolute inset-y-0 right-0 z-10 w-1/3" onClick={() => setI(Math.max(0, i - 1))} />
      <button className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={next} />

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="relative flex min-h-dvh flex-col justify-between p-8"
          style={{ background: s.bg }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pt-16 text-xs opacity-80">التقرير الأسبوعي · {s.title}</div>

          {s.kind === "chart" ? (
            <div className="flex flex-col items-center">
              <div className="num text-6xl font-black tracking-tight">{s.big}</div>
              <div className="mt-1 text-sm font-bold opacity-90">{s.sub}</div>
              <div className="mt-6 flex h-56 w-full items-end justify-between gap-2">
                {week.map((v, idx) => {
                  const h = Math.max(8, (v / weekMax) * 100);
                  const isPeak = idx === peakIdx;
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className={`num text-[10px] font-bold ${isPeak ? "text-white" : "text-white/70"}`}>{v}</div>
                      <div className="relative flex w-full flex-1 items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.9, delay: idx * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                          className={`w-full rounded-t-lg ${isPeak ? "bg-white" : "bg-white/40"}`}
                        />
                      </div>
                      <div className="text-[10px] opacity-80">{DAYS[idx]}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs opacity-80">{s.note}</div>
            </div>
          ) : s.kind === "model" ? (
            <div className="text-center">
              <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white/15 backdrop-blur"><IIcon e={s.emoji} className="h-12 w-12" /></motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="num mt-8 text-7xl font-black tracking-tight">{s.big}</motion.div>
              <div className="mt-2 text-lg font-bold">{s.sub}</div>
              <div className="mt-3 text-sm opacity-80">{s.note}</div>
              {pred && (
                <div className="mx-auto mt-5 grid w-full max-w-xs grid-cols-3 gap-2 text-[10px]">
                  {(["Healthy","At Risk","Burnout"] as const).map((k) => (
                    <div key={k} className="rounded-xl bg-white/10 p-2 backdrop-blur">
                      <div className="opacity-80">{k}</div>
                      <div className="num mt-0.5 text-sm font-black">{Math.round((pred.probabilities[k] ?? 0) * 100)}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white/15 backdrop-blur"><IIcon e={s.emoji} className="h-12 w-12" /></motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="num mt-8 text-7xl font-black tracking-tight">{s.big}</motion.div>
              <div className="mt-2 text-lg font-bold">{s.sub}</div>
              <div className="mt-3 text-sm opacity-80">{s.note}</div>
            </div>
          )}

          <Btn variant="secondary" full onClick={next}>{i < SLIDES.length - 1 ? "التالي" : "إنهاء"}</Btn>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
