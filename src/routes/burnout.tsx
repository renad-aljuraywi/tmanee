import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Ring } from "@/components/mobile/Ring";
import { useStore } from "@/lib/store";
import { burnoutTier } from "@/lib/format";
import { AlertTriangle, Utensils, PiggyBank, ShoppingBag, CalendarDays, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/burnout")({ component: Burnout });

function Burnout() {
  const s = useStore((x) => x);
  const t = burnoutTier(s.burnoutScore);

  return (
    <Screen>
      <TopBar title="مؤشر الاستنزاف المالي" />
      <div className="grid place-items-center pt-6">
        <Ring value={s.burnoutScore} max={100} size={220} stroke={16} color={`var(--${t.color})`} track="var(--muted)">
          <div className="text-center">
            <div className="num text-6xl font-black">{s.burnoutScore}</div>
            <div className="text-xs text-muted-foreground">من 100</div>
            <div className={`mt-1 text-sm font-black text-${t.color}`}>{t.label}</div>
          </div>
        </Ring>
      </div>

      <Card className={`mx-4 mt-6 !bg-${t.color}-soft border-${t.color}/20`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className={`h-5 w-5 text-${t.color}`} />
          <div>
            <div className={`text-sm font-black text-${t.color}`}>{t.tone}</div>
            <div className="mt-1 text-xs text-muted-foreground">إذا استمر هذا النمط قد تواجه ضغطاً مالياً قبل نهاية الشهر.</div>
          </div>
        </div>
      </Card>

      <div className="mx-4 mt-6 text-sm font-bold">لماذا يرتفع المؤشر؟</div>
      <div className="mx-4 mt-2 space-y-2">
        <Reason icon={<Utensils className="h-4 w-4" />} label="زيادة الإنفاق على المطاعم" delta="+22%" />
        <Reason icon={<PiggyBank className="h-4 w-4" />} label="ضعف الادّخار هذا الشهر" delta="-40%" />
        <Reason icon={<ShoppingBag className="h-4 w-4" />} label="كثرة عمليات الشراء الصغيرة" delta="+18" />
        <Reason icon={<CalendarDays className="h-4 w-4" />} label="الاعتماد على الشراء المؤجّل" delta="+3 عمليات" />
      </div>

      <Card className="mx-4 mt-4 !bg-success-soft border-success/20">
        <div className="flex items-center gap-2 text-sm font-bold text-success">
          <Lightbulb className="h-4 w-4" /> نصيحة من منيع
        </div>
        <p className="mt-1 text-xs">حاول تقليل مصروفات الترفيه هذا الأسبوع، سيتحسّن مؤشرك بشكل واضح خلال 3 أيام.</p>
      </Card>

      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <Link to="/what-if" className="tap rounded-2xl bg-primary p-4 text-center text-primary-foreground font-bold">محاكاة قرار</Link>
        <Link to="/recovery" className="tap rounded-2xl bg-surface border border-border p-4 text-center font-bold">وضع التعافي</Link>
      </div>
    </Screen>
  );
}

function Reason({ icon, label, delta }: { icon: React.ReactNode; label: string; delta: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-warning-soft text-warning">{icon}</div>
        <div className="text-sm font-semibold">{label}</div>
      </div>
      <div className="num text-xs font-bold text-danger">{delta}</div>
    </div>
  );
}
