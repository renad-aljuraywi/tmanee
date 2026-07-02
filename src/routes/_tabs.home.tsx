import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, ChevronLeft, Sparkles, Accessibility, Type, Eye } from "lucide-react";
import { Card, Screen, SectionTitle, Sheet } from "@/components/mobile/Shell";
import { Ring, Bar } from "@/components/mobile/Ring";
import { useStore, setState, categoryLabel } from "@/lib/store";
import { CategoryIcon } from "@/components/mobile/CategoryIcon";

import { fmtSAR, burnoutTier, fmtTime } from "@/lib/format";
import { useState } from "react";

export const Route = createFileRoute("/_tabs/home")({ component: Home });

function Home() {
  const s = useStore((x) => x);
  const [a11yOpen, setA11yOpen] = useState(false);
  const remainingSalary = s.salary - s.fixed - s.loans - s.transactions.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
  const tier = burnoutTier(s.burnoutScore);
  const perDay = Math.round(remainingSalary / Math.max(1, s.daysUntilPayday));
  const recentTx = s.transactions.filter(t => t.amount < 0).slice(0, 4);
  const topCats = Object.entries(s.budgets).slice(0, 4) as [any, any][];

  return (
    <Screen>
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-start justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
            {s.user.name[0]}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">مرحباً 👋</div>
            <div className="font-bold">{s.user.name}</div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setA11yOpen(true)}
            aria-label="إمكانية الوصول"
            className="tap grid h-11 w-11 place-items-center rounded-full bg-surface border border-border"
          >
            <Accessibility className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link to="/notifications" className="tap relative grid h-11 w-11 place-items-center rounded-full bg-surface border border-border">
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-danger" />
          </Link>
        </div>
      </div>

      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.42_0.2_285)] p-5 text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs opacity-80">المتبقّي من راتبك</div>
            <div className="num mt-1 text-4xl font-black">
              {fmtSAR(remainingSalary)} <span className="text-lg font-bold opacity-80">ر.س</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-[10px] opacity-80">الراتب القادم</div>
            <div className="num text-xl font-bold">{s.daysUntilPayday} يوم</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/10 p-3 text-xs backdrop-blur">
          مصروفك المتاح يومياً: <span className="num font-bold">{fmtSAR(perDay)}</span> ر.س
        </div>
      </motion.div>

      {/* Burnout wide card */}
      <Link to="/burnout" className="block mx-4 mt-3">
        <Card className="tap">
          <div className="flex items-center gap-4">
            <Ring
              value={s.burnoutScore} max={100} size={92} stroke={9}
              color={`var(--${tier.color})`}
              track="color-mix(in oklab, var(--muted) 90%, transparent)"
            >
              <div className="text-center">
                <div className="num text-xl font-black">{s.burnoutScore}</div>
                <div className="text-[9px] text-muted-foreground">/ 100</div>
              </div>
            </Ring>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">مؤشر الاستنزاف المالي</div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-${tier.color}-soft text-${tier.color}`}>
                  {tier.label}
                </span>
                <span className="text-[11px] text-muted-foreground">{tier.tone}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                ارتفاع طفيف بسبب زيادة الإنفاق على المطاعم والتسوّق المتأخر هذا الأسبوع.
              </p>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
          </div>
        </Card>
      </Link>

      {/* Two smaller cards */}
      <div className="mt-3 grid grid-cols-2 gap-3 px-4">
        <Card className="!p-3.5">
          <div className="text-[11px] text-muted-foreground">ادّخار هذا الشهر</div>
          <div className="num mt-0.5 text-xl font-black text-success">+{fmtSAR(s.savedThisMonth)}</div>
          <Bar value={s.savedThisMonth} max={s.savingsGoal} color="var(--success)" className="mt-2" />
        </Card>
        <Card className="!p-3.5">
          <div className="text-[11px] text-muted-foreground">إنفاق اليوم</div>
          <div className="num mt-0.5 text-xl font-black">{fmtSAR(s.todaySpend)}</div>
          <div className="mt-1 text-[10px] text-success">أقل 18% من المعتاد ✓</div>
        </Card>
      </div>

      {/* AI insight */}
      <Link to="/alerts">
        <Card className="mx-4 mt-3 !bg-primary-soft border-primary/20">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-primary">اكتشاف من منيع</div>
              <div className="mt-0.5 text-sm font-bold leading-snug">
                تنفق أكثر بعد الساعة 9 مساءً. جرّب إغلاق تطبيقات التسوق مساءً هذا الأسبوع.
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
        </Card>
      </Link>

      {/* Category rings */}
      <SectionTitle action={<Link to="/budget" className="text-xs font-bold text-primary">تعديل</Link>}>
        الميزانية الشهرية
      </SectionTitle>
      <div className="grid grid-cols-4 gap-2 px-4">
        {topCats.map(([cat, b]) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const color = pct > 90 ? "var(--danger)" : pct > 70 ? "var(--warning)" : "var(--success)";
          return (
            <div key={cat} className="flex flex-col items-center gap-1">
              <Ring value={b.spent} max={b.limit} size={62} stroke={7} color={color} track="var(--muted)">
                <span className="num text-[11px] font-bold">{pct}%</span>
              </Ring>
              <div className="text-[10px] text-muted-foreground">{categoryLabel(cat)}</div>
            </div>
          );
        })}
      </div>

      {/* Recent transactions */}
      <SectionTitle action={<Link to="/transactions" className="text-xs font-bold text-primary">عرض الكل</Link>}>
        آخر العمليات
      </SectionTitle>
      <div className="mx-4 divide-y divide-border rounded-2xl border border-border bg-surface">
        {recentTx.map((t) => (
          <Link
            key={t.id}
            to="/transaction/$id"
            params={{ id: t.id }}
            className="tap flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><CategoryIcon category={t.category} /></div>
              <div>
                <div className="text-sm font-bold">{t.merchant}</div>
                <div className="text-[11px] text-muted-foreground">{categoryLabel(t.category)} · {fmtTime(t.date)}</div>
              </div>
            </div>
            <div className="num text-sm font-black text-danger">-{fmtSAR(Math.abs(t.amount))}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <SectionTitle>اختصارات</SectionTitle>
      <div className="grid grid-cols-3 gap-3 px-4">
        <QuickAction to="/what-if" emoji="🔮" label="ماذا لو؟" />
        <QuickAction to="/weekly-report" emoji="📊" label="تقرير الأسبوع" />
        <QuickAction to="/achievements" emoji="🏆" label="إنجازات" />
      </div>

      <Sheet open={a11yOpen} onClose={() => setA11yOpen(false)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Accessibility className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="font-bold">إمكانية الوصول</div>
            <div className="text-xs text-muted-foreground">اضبط التطبيق حسب راحتك</div>
          </div>
        </div>
        <div className="space-y-2">
          <A11yRow
            icon={<Type className="h-4 w-4" strokeWidth={1.75} />}
            label="تكبير الخط"
            active={s.fontScale === 1.15}
            onClick={() => setState({ fontScale: 1.15 })}
          />
          <A11yRow
            icon={<Type className="h-3 w-3" strokeWidth={1.75} />}
            label="تصغير الخط"
            active={s.fontScale === 0.9}
            onClick={() => setState({ fontScale: 0.9 })}
          />
          <A11yRow
            icon={<Type className="h-4 w-4" strokeWidth={1.75} />}
            label="الحجم الافتراضي"
            active={s.fontScale === 1}
            onClick={() => setState({ fontScale: 1 })}
          />
          <A11yRow
            icon={<Eye className="h-4 w-4" strokeWidth={1.75} />}
            label="وضع عمى الألوان"
            active={s.colorblind}
            onClick={() => setState({ colorblind: !s.colorblind })}
          />
        </div>
      </Sheet>
    </Screen>
  );
}

function A11yRow({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`tap flex w-full items-center justify-between rounded-2xl border p-4 ${active ? "border-primary bg-primary-soft" : "border-border bg-surface"}`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className={`h-4 w-4 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`} />
    </button>
  );
}

function QuickAction({ to, emoji, label }: { to: any; emoji: string; label: string }) {
  return (
    <Link to={to} className="card-elevated tap flex flex-col items-center gap-1 p-4 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="text-xs font-bold">{label}</div>
    </Link>
  );
}
