import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { Bell, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { refreshBurnoutFromBackend, type BurnoutAssessment } from "@/lib/ai";
import { alertsFromLabel, type ModelAlert } from "@/lib/format";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const alerts = useStore((s) => s.alerts);
  const score = useStore((s) => s.burnoutScore);
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

  const label = assessment?.label ?? (score < 35 ? "Healthy" : score < 75 ? "At Risk" : "Burnout");
  const modelAlerts: ModelAlert[] = alertsFromLabel(label);

  return (
    <Screen>
      <TopBar title="الإشعارات" />
      <div className="px-4 pt-2 space-y-2">
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-xs font-bold text-primary">تنبيهات من النموذج</div>
          </div>
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/70" />}
        </div>

        {modelAlerts.map((a) => (
          <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-${a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "primary"}-soft`}>
              <Sparkles className={`h-4 w-4 text-${a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "primary"}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{a.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{a.body}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{a.time}</div>
            </div>
          </div>
        ))}

        <div className="px-1 pt-3 pb-1 text-xs font-bold text-muted-foreground">إشعارات أخرى</div>

        {alerts.map((a) => (
          <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-${a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "primary"}-soft`}>
              <Bell className={`h-4 w-4 text-${a.severity === "danger" ? "danger" : a.severity === "warning" ? "warning" : "primary"}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{a.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{a.body}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
