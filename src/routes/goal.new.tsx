import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { setState, getState } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/goal/new")({ component: NewGoal });

const TEMPLATES = [
  { emoji: "🚗", name: "سيارة", color: "oklch(0.65 0.15 155)" },
  { emoji: "🏠", name: "منزل", color: "oklch(0.55 0.15 45)" },
  { emoji: "✈️", name: "سفر", color: "oklch(0.7 0.15 40)" },
  { emoji: "📱", name: "آيفون", color: "oklch(0.55 0.18 275)" },
  { emoji: "🪙", name: "ذهب", color: "oklch(0.75 0.15 85)" },
  { emoji: "💍", name: "زواج", color: "oklch(0.65 0.18 350)" },
];

function NewGoal() {
  const nav = useNavigate();
  const [t, setT] = useState(TEMPLATES[0]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(5000);
  const [monthly, setMonthly] = useState(500);

  const create = () => {
    const g = { id: `g${Date.now()}`, emoji: t.emoji, name: name || t.name, target, saved: 0, monthly, color: t.color };
    setState({ goals: [...getState().goals, g] });
    nav({ to: "/goals" });
  };

  return (
    <Screen>
      <TopBar title="هدف جديد" />
      <div className="px-4 pt-2">
        <div className="text-sm font-bold">اختر قالباً</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TEMPLATES.map((x) => (
            <button
              key={x.name} onClick={() => { setT(x); setName(x.name); }}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 ${t.emoji === x.emoji ? "border-primary bg-primary-soft" : "border-border bg-surface"}`}
            >
              <div className="text-3xl">{x.emoji}</div>
              <div className="text-[11px] font-bold">{x.name}</div>
            </button>
          ))}
        </div>

        <Card className="mt-4 space-y-4">
          <F label="اسم الهدف">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name}
              className="h-12 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </F>
          <F label="المبلغ المستهدف (ريال)">
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))}
              className="num h-12 w-full rounded-xl border border-border bg-surface px-3 text-lg font-bold outline-none focus:border-primary" />
          </F>
          <F label="ادّخار شهري (ريال)">
            <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
              className="num h-12 w-full rounded-xl border border-border bg-surface px-3 text-lg font-bold outline-none focus:border-primary" />
          </F>
          <div className="rounded-xl bg-primary-soft p-3 text-xs text-primary">
            ستحقق هدفك خلال ~{Math.ceil(target / Math.max(1, monthly))} شهر بمعدّل الادّخار الحالي.
          </div>
        </Card>

        <Btn full size="lg" className="mt-4" onClick={create}>إنشاء الهدف</Btn>
      </div>
    </Screen>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>{children}</label>;
}
