import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { Switch } from "@/components/ui/switch";
import {
  ASSISTANT_PERM_LABELS,
  AssistantPermKey,
  RESTRICTED_ASSISTANT_ACTIONS,
  setState,
  useStore,
} from "@/lib/store";
import { Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/trusted-assistant/permissions")({ component: Permissions });

function Permissions() {
  const nav = useNavigate();
  const ta = useStore((x) => x.trustedAssistant);
  const [perms, setPerms] = useState(ta?.permissions ?? null);

  if (!ta || !perms) {
    return (
      <Screen>
        <TopBar title="الصلاحيات" />
        <div className="px-4 pt-6 text-sm text-muted-foreground">لا يوجد مساعد موثوق حاليًا.</div>
      </Screen>
    );
  }

  const save = () => {
    setState({ trustedAssistant: { ...ta, permissions: perms } });
    nav({ to: "/profile" });
  };

  return (
    <Screen>
      <TopBar title="تعديل الصلاحيات" />
      <div className="px-4 pt-2 space-y-3">
        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            <div className="text-sm font-bold">صلاحيات {ta.name}</div>
          </div>
          <div className="mt-3 divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {(Object.keys(ASSISTANT_PERM_LABELS) as AssistantPermKey[]).map((k) => (
              <div key={k} className="flex items-center justify-between p-3.5">
                <div className="text-sm font-semibold">{ASSISTANT_PERM_LABELS[k]}</div>
                <Switch
                  checked={perms[k]}
                  onCheckedChange={(v) => setPerms((p) => (p ? { ...p, [k]: v } : p))}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-danger/5 border border-danger/20">
          <div className="flex items-center gap-2 text-danger">
            <Lock className="h-4 w-4" strokeWidth={1.75} />
            <div className="text-sm font-bold">غير قابلة للتفويض</div>
          </div>
          <div className="mt-2 space-y-1.5">
            {RESTRICTED_ASSISTANT_ACTIONS.map((a) => (
              <div key={a} className="flex items-center gap-2 text-[12px] text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                {a}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-2 px-1 pt-1">
          <Btn variant="outline" onClick={() => nav({ to: "/profile" })}>إلغاء</Btn>
          <Btn onClick={save}>حفظ التغييرات</Btn>
        </div>
      </div>
    </Screen>
  );
}
