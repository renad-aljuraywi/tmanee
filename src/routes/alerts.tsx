import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/alerts")({ component: Alerts });

function Alerts() {
  const alerts = useStore((s) => s.alerts);
  return (
    <Screen>
      <TopBar title="التنبيهات الذكية" />
      <div className="px-4 pt-2">
        <Card className="!bg-danger-soft border-danger/20 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-black text-danger">تنبيه ذكي</div>
              <div className="mt-1 text-xs">لاحظنا ارتفاعاً غير معتاد في الإنفاق. إذا استمر النمط سيبقى لك 280 ريال فقط قبل الراتب.</div>
              <div className="mt-3 flex gap-2">
                <Link to="/what-if" className="tap rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">عرض الحل</Link>
                <Link to="/burnout" className="tap rounded-full bg-surface border border-border px-4 py-1.5 text-xs font-bold">أفهم السبب</Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className={`flex gap-3 rounded-2xl border border-border bg-surface p-3.5`}>
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-${a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "primary"}-soft`}>
                {a.severity === "danger" ? <AlertTriangle className="h-4 w-4 text-muted-foreground" /> : a.severity === "warning" ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <Info className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{a.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.body}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
