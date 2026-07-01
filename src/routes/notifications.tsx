import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const alerts = useStore((s) => s.alerts);
  return (
    <Screen>
      <TopBar title="الإشعارات" />
      <div className="px-4 pt-2 space-y-2">
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
