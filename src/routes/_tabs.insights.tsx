import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, Card, SectionTitle } from "@/components/mobile/Shell";
import { Bar } from "@/components/mobile/Ring";
import { useStore, categoryLabel } from "@/lib/store";
import { CategoryIcon } from "@/components/mobile/CategoryIcon";

import { fmtSAR } from "@/lib/format";
import { patternsFromLabel } from "@/lib/format";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { refreshBurnoutFromBackend, type BurnoutAssessment } from "@/lib/ai";

export const Route = createFileRoute("/_tabs/insights")({ component: Insights });

const DAYS = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];

function Insights() {
  const s = useStore((x) => x);
  const cats = Object.entries(s.budgets).sort((a, b) => b[1].spent - a[1].spent);
  const topCat = cats[0][0] as any;
  const topSpent = cats[0][1].spent;
  const totalSpent = cats.reduce((a, [, v]) => a + v.spent, 0);
  const topPct = Math.round((topSpent / totalSpent) * 100);
  const week = useMemo(() => Array.from({ length: 7 }, () => Math.floor(Math.random() * 380) + 120), []);
  const weekMax = Math.max(...week);
  const peakIdx = week.indexOf(weekMax);

  const [assessment, setAssessment] = useState<BurnoutAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    refreshBurnoutFromBackend()
      .then((a) => { if (alive) setAssessment(a); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const patterns = patternsFromLabel(assessment?.label ?? (s.burnoutScore < 35 ? "Healthy" : s.burnoutScore < 75 ? "At Risk" : "Burnout"));

  return (
    <Screen>
      <div className="px-5 pt-8 pb-2 text-center">
        <h1 className="text-2xl font-black">التحليل</h1>
        <p className="text-sm text-muted-foreground">لمحة ذكية عن عاداتك المالية.</p>
      </div>

      {/* Top category */}
      <Card className="mx-4 mt-3 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary"><CategoryIcon category={topCat} className="h-7 w-7" /></div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">أكثر فئة تستنزف راتبك</div>
          <div className="mt-0.5 font-bold">{categoryLabel(topCat)}</div>
        </div>
        <div className="num text-3xl font-black">{topPct}%</div>
      </Card>

      {/* Weekly chart */}
      <SectionTitle action={<Link to="/weekly-report" className="text-xs font-bold text-primary">التقرير</Link>}>
        آخر 7 أيام
      </SectionTitle>
      <Card className="mx-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">إجمالي الأسبوع</div>
          <div className="num text-sm font-black">{fmtSAR(week.reduce((a, b) => a + b, 0))} ر.س</div>
        </div>
        <div className="mt-4 flex h-44 items-end justify-between gap-2">
          {week.map((v: number, i: number) => {
            const h = Math.max(6, (v / weekMax) * 100);
            const isPeak = i === peakIdx;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className={`num text-[10px] font-bold ${isPeak ? "text-primary" : "text-muted-foreground"}`}>{v}</div>
                <div className="relative flex w-full flex-1 items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                    className={`w-full rounded-t-lg ${isPeak ? "bg-primary" : "bg-primary/30"}`}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">{DAYS[i]}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI patterns — driven by model label */}
      <SectionTitle>اكتشافات AI</SectionTitle>
      <Card className="mx-4 !bg-primary-soft border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-sm font-bold text-primary">أنماط سلوكية</div>
          </div>
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/70" />
          ) : assessment ? (
            <div className="text-[10px] font-bold text-primary/70">من النموذج</div>
          ) : null}
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {patterns.map((p, i) => (
            <li key={i} className="flex gap-2"><span>•</span> {p}</li>
          ))}
        </ul>
      </Card>


      {/* Comparison */}
      <SectionTitle>مقارنة سريعة</SectionTitle>
      <div className="mx-4 grid grid-cols-2 gap-3">
        <Card>
          <div className="text-xs text-muted-foreground">الشهر الماضي</div>
          <div className="num mt-1 text-2xl font-black">{fmtSAR(4320)}</div>
          <div className="text-[10px] text-muted-foreground">ريال</div>
        </Card>
        <Card>
          <div className="text-xs text-muted-foreground">هذا الشهر</div>
          <div className="num mt-1 text-2xl font-black">{fmtSAR(4850)}</div>
          <div className="text-[10px] font-bold text-danger">+12% عن السابق</div>
        </Card>
      </div>

      {/* Category breakdown */}
      <SectionTitle>الفئات</SectionTitle>
      <div className="mx-4 space-y-2">
        {cats.map(([cat, b]) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const color = pct > 90 ? "var(--danger)" : pct > 70 ? "var(--warning)" : "var(--success)";
          return (
            <Card key={cat} className="!p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><CategoryIcon category={cat as any} /></div>
                  <div>
                    <div className="text-sm font-bold">{categoryLabel(cat as any)}</div>
                    <div className="num text-[11px] text-muted-foreground">
                      {fmtSAR(b.spent)} / {fmtSAR(b.limit)}
                    </div>
                  </div>
                </div>
                <div className="num text-sm font-black">{pct}%</div>
              </div>
              <Bar value={b.spent} max={b.limit} color={color} className="mt-2" />
            </Card>
          );
        })}
      </div>

    </Screen>
  );
}
