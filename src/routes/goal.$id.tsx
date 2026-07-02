import { createFileRoute, Link } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, TopBar, Card, Sheet } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useStore, setState, getState } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Party } from "@/components/mobile/Party";
import { Plus, Pencil, PiggyBank, CalendarDays, Wallet } from "lucide-react";

export const Route = createFileRoute("/goal/$id")({ component: GoalDetail });

// Build tiles from realistic denominations (50/100/150/200/250 scaled to target)
// so the sum equals the target exactly and each tile shows a real ر.س amount.
function buildTiles(target: number): number[] {
  const scale = Math.max(1, Math.pow(10, Math.floor(Math.log10(Math.max(1000, target) / 1000))));
  const base = 50 * scale;
  const denoms = [1, 2, 3, 4, 5].map((x) => x * base);
  const tiles: number[] = [];
  let remaining = target;
  let i = 0;
  while (remaining > 0 && tiles.length < 80) {
    let v = denoms[i % denoms.length];
    if (v > remaining) v = remaining;
    tiles.push(v);
    remaining -= v;
    i++;
  }
  return tiles.sort((a, b) => a - b);
}

function tileColor(v: number, max: number) {
  const pct = v / max;
  if (pct < 0.34) return "oklch(0.94 0.04 275)";
  if (pct < 0.67) return "oklch(0.85 0.09 275)";
  return "oklch(0.72 0.14 275)";
}

function GoalDetail() {
  const { id } = Route.useParams();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const [showParty, setShowParty] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addAmt, setAddAmt] = useState(100);

  const tiles = useMemo(() => (goal ? buildTiles(goal.target) : []), [goal?.id, goal?.target]);
  const maxTile = tiles.length ? Math.max(...tiles) : 1;
  const minTile = tiles.length ? Math.min(...tiles) : 1;

  if (!goal)
    return (
      <Screen>
        <TopBar />
        <div className="p-6 text-center text-muted-foreground">الهدف غير موجود</div>
      </Screen>
    );

  const pct = Math.round((goal.saved / goal.target) * 100);
  const remaining = Math.max(0, goal.target - goal.saved);
  const months = Math.ceil(remaining / Math.max(1, goal.monthly));
  const eta = new Date();
  eta.setMonth(eta.getMonth() + months);
  const etaLabel = eta.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Determine which tiles are filled (cumulative sum <= saved)
  let acc = 0;
  const filled = tiles.map((v) => {
    const isFilled = acc + v <= goal.saved;
    if (isFilled) acc += v;
    return isFilled;
  });

  const addAmount = () => {
    const g = getState().goals.map((x) =>
      x.id === goal.id ? { ...x, saved: Math.min(x.target, x.saved + addAmt) } : x
    );
    setState({ goals: g });
    setAddOpen(false);
    if (goal.saved + addAmt >= goal.target) setShowParty(true);
  };

  return (
    <Screen>
      <TopBar title="تفاصيل الهدف" />
      {showParty && <Party />}

      <div className="px-4 pt-2 space-y-3">
        {/* Header card */}
        <Card className="!bg-primary-soft border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground">هدف</div>
              <div className="mt-0.5 text-2xl font-black">{goal.name}</div>
            </div>
            <div className="text-primary"><IIcon e={goal.emoji} className="h-9 w-9" /></div>
          </div>
          <div className="num mt-3 text-3xl font-black text-primary">{pct}%</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <div className="num mt-2 text-xs text-muted-foreground text-left">
            {fmtSAR(goal.saved)} / {fmtSAR(goal.target)} ريال
          </div>
        </Card>

        {/* Saving challenge board */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-2">
              <PiggyBank className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <span className="text-sm font-black text-primary">لوحة الادّخار</span>
            </div>
            <div className="text-[11px] text-muted-foreground num">
              {filled.filter(Boolean).length} / {tiles.length}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {tiles.map((v, i) => {
              const bg = tileColor(v, maxTile);
              const size = 0.9 + 0.35 * ((v - minTile) / Math.max(1, maxTile - minTile));
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: filled[i] ? [1, 1.12, 1] : 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: filled[i] ? Math.min(0.4, i * 0.01) : 0 }}
                  className="relative aspect-square rounded-2xl grid place-items-center font-black num overflow-hidden"
                  style={{
                    background: filled[i] ? "var(--primary)" : bg,
                    color: filled[i] ? "var(--primary-foreground)" : "var(--foreground)",
                    boxShadow: filled[i] ? "0 6px 14px -6px color-mix(in oklab, var(--primary) 45%, transparent)" : "none",
                    fontSize: `${size * 0.72}rem`,
                    lineHeight: 1,
                  }}
                >
                  {v}
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="!p-3.5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" strokeWidth={1.75} /> المتبقّي
            </div>
            <div className="num mt-1 text-xl font-black">{fmtSAR(remaining)} <span className="text-xs font-bold text-muted-foreground">ر.س</span></div>
          </Card>
          <Card className="!p-3.5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} /> التاريخ المتوقّع
            </div>
            <div className="mt-1 text-lg font-black text-primary">{etaLabel}</div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Btn variant="outline">
            <Pencil className="h-4 w-4" strokeWidth={1.75} /> تعديل الهدف
          </Btn>
          <Btn onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={2} /> إضافة مبلغ
          </Btn>
        </div>

        <Card className="!p-4">
          <Btn
            full
            size="lg"
            variant={goal.claimed ? "secondary" : "primary"}
            disabled={goal.claimed || remaining > 0}
            onClick={() => {
              const g = getState().goals.map((x) =>
                x.id === goal.id ? { ...x, claimed: true } : x
              );
              setState({ goals: g });
              setShowParty(true);
            }}
          >
            <Gift className="h-5 w-5" strokeWidth={1.75} />
            {goal.claimed ? "تم تسليم الهدف" : "تسلم الهدف"}
          </Btn>
          {!goal.claimed && remaining > 0 && (
            <div className="mt-2 text-center text-xs text-muted-foreground">
              متاح بعد اكتمال المبلغ بالكامل
            </div>
          )}
        </Card>
      </div>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)}>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">أضف مبلغاً إلى</div>
          <div className="mt-0.5 font-bold">{goal.name}</div>
          <div className="num mt-4 text-4xl font-black text-primary">{fmtSAR(addAmt)}</div>
          <div className="text-xs text-muted-foreground">ريال</div>
          <input
            type="range" min={50} max={Math.max(500, remaining)} step={50}
            value={addAmt}
            onChange={(e) => setAddAmt(Number(e.target.value))}
            className="mt-5 w-full accent-primary"
          />
          <div className="mt-2 flex justify-center gap-2">
            {[100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setAddAmt(v)}
                className="tap rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold num"
              >
                +{v}
              </button>
            ))}
          </div>
          <Btn full size="lg" className="mt-6" onClick={addAmount}>تأكيد الإضافة</Btn>
        </div>
      </Sheet>
    </Screen>
  );
}
