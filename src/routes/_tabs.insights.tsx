import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, Card, SectionTitle } from "@/components/mobile/Shell";
import { Bar } from "@/components/mobile/Ring";
import { useStore, categoryLabel, categoryIcon } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_tabs/insights")({ component: Insights });

const WEEK = [40, 65, 30, 55, 90, 120, 75];
const DAYS = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];

function Insights() {
  const s = useStore((x) => x);
  const cats = Object.entries(s.budgets).sort((a, b) => b[1].spent - a[1].spent);
  const topCat = cats[0][0] as any;
  const topSpent = cats[0][1].spent;
  const totalSpent = cats.reduce((a, [, v]) => a + v.spent, 0);
  const topPct = Math.round((topSpent / totalSpent) * 100);

  return (
    <Screen>
      <div className="px-5 pt-8 pb-2">
        <h1 className="text-2xl font-black">التحليل</h1>
        <p className="text-sm text-muted-foreground">لمحة ذكية عن عاداتك المالية.</p>
      </div>

      {/* Top category */}
      <Card className="mx-4 mt-3 flex items-center gap-4">
        <div className="text-5xl">{categoryIcon(topCat)}</div>
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
        <div className="text-xs text-muted-foreground">الإنفاق يرتفع كل خميس</div>
        <div className="mt-4 flex h-40 items-end justify-between gap-2">
          {WEEK.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(v / 120) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                className={`w-full rounded-t-lg ${i === 5 ? "bg-primary" : "bg-primary/25"}`}
              />
              <div className="text-[10px] text-muted-foreground">{DAYS[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI patterns */}
      <SectionTitle>اكتشافات AI</SectionTitle>
      <Card className="mx-4 !bg-primary-soft border-primary/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <div className="text-sm font-bold text-primary">أنماط سلوكية</div>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex gap-2"><span>•</span> تزيد مشترياتك بعد الساعة 9 مساءً</li>
          <li className="flex gap-2"><span>•</span> تشتري كثيراً بعد استلام الراتب مباشرة</li>
          <li className="flex gap-2"><span>•</span> تنفق أكثر عند نهاية الأسبوع</li>
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
                  <div className="text-xl">{categoryIcon(cat as any)}</div>
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

      <Link to="/what-if" className="mx-4 mt-6 flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground">
        <div>
          <div className="text-xs opacity-80">جرّب</div>
          <div className="font-bold">محاكي "ماذا لو؟" لأي عملية شراء</div>
        </div>
        <ChevronLeft className="h-5 w-5" />
      </Link>
    </Screen>
  );
}
