import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { useStore, setState } from "@/lib/store";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const s = useStore((x) => x);
  return (
    <Screen>
      <TopBar title="الإعدادات" />
      <SectionTitle>الملف المالي</SectionTitle>
      <div className="mx-4 space-y-2">
        <Field label="راتب شهري" value={s.salary} onChange={(v) => setState({ salary: v })} />
        <Field label="مصاريف ثابتة" value={s.fixed} onChange={(v) => setState({ fixed: v })} />
        <Field label="أقساط وقروض" value={s.loans} onChange={(v) => setState({ loans: v })} />
        <Field label="هدف ادّخار شهري" value={s.savingsGoal} onChange={(v) => setState({ savingsGoal: v })} />
      </div>

      <SectionTitle>عام</SectionTitle>
      <div className="mx-4 divide-y divide-border rounded-2xl border border-border bg-surface">
        <Row label="اللغة" value="العربية" />
        <Row label="العملة" value="ريال سعودي (SAR)" />
        <Row label="تنبيهات" value="مفعّلة" />
      </div>
    </Screen>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5">
      <div className="text-sm font-semibold">{label}</div>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="num h-10 w-28 rounded-xl bg-muted px-3 text-left text-base font-bold outline-none focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-sm font-semibold">{label}</div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">{value}<ChevronLeft className="h-4 w-4" /></div>
    </div>
  );
}
