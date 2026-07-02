import { createFileRoute, Link } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, TopBar, Card, Sheet } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useStore, setState, getState } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Party } from "@/components/mobile/Party";
import { Plus, Pencil, Target as TargetIcon, CalendarDays, Wallet } from "lucide-react";

export const Route = createFileRoute("/goal/$id")({ component: GoalDetail });

// Build a deterministic set of tiles that sum to target,
// with varied denominations (mimics the saving-challenge board).
function buildTiles(target: number): number[] {
  const denoms = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600];
  const tiles: number[] = [];
  let remaining = target;
  let i = 0;
  // Aim for ~35 tiles
  const avg = Math.max(50, Math.round(target / 35));
  // pick closest denom step to avg
  const step = denoms.reduce((p, c) => (Math.abs(c - avg) < Math.abs(p - avg) ? c : p), denoms[0]);
  while (remaining > 0 && tiles.length < 42) {
    const jitter = [step * 0.6, step * 0.8, step, step * 1.2, step * 1.5];
    const raw = jitter[i % jitter.length];
    const val = Math.min(remaining, Math.max(50, Math.round(raw / 50) * 50));
    tiles.push(val);
    remaining -= val;
    i++;
  }
  // sort ascending for nice gradient rows
  return tiles.sort((a, b) => a - b);
}

function tileColor(v: number, max: number) {
  const pct = v / max;
  if (pct < 0.15) return "oklch(0.955 0.028 275)";
  if (pct < 0.3) return "oklch(0.92 0.05 275)";
  if (pct < 0.5) return "oklch(0.88 0.09 275)";
  if (pct < 0.7) return "oklch(0.78 0.13 275)";
  return "oklch(0.62 0.18 275)";
}

function GoalDetail() {
  const { id } = Route.useParams();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const [showParty, setShowParty] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addAmt, setAddAmt] = useState(100);

  const tiles = useMemo(() => (goal ? buildTiles(goal.target) : []), [goal?.target, goal?.id]);
  const maxTile = tiles.length ? Math.max(...tiles) : 1;

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
          <div className="mb-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5">
              <TargetIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-xs font-bold text-primary">لوحة الادّخار</span>
            </div>
            <div className="text-[11px] text-muted-foreground">{filled.filter(Boolean).length} / {tiles.length}</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {tiles.map((v, i) => {
              const bg = tileColor(v, maxTile);
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    scale: filled[i] ? [1, 1.15, 1] : 1,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.4, delay: filled[i] ? Math.min(0.4, i * 0.01) : 0 }}
                  className="relative aspect-square rounded-full grid place-items-center text-[10px] font-black num overflow-hidden"
                  style={{
                    background: filled[i] ? "var(--primary)" : bg,
                    color: filled[i] ? "var(--primary-foreground)" : "var(--foreground)",
                    boxShadow: filled[i] ? "0 4px 12px -4px color-mix(in oklab, var(--primary) 40%, transparent)" : "none",
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

        <div className="grid grid-cols-2 gap-3 pb-4">
          <Btn variant="outline">
            <Pencil className="h-4 w-4" strokeWidth={1.75} /> تعديل الهدف
          </Btn>
          <Btn onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={2} /> إضافة مبلغ
          </Btn>
        </div>
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
