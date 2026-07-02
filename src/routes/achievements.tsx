import { createFileRoute } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, SlidersHorizontal, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/achievements")({ component: Achievements });

const FILTERS = [
  { id: "all", label: "جميع الإنجازات" },
  { id: "this_month", label: "هذا الشهر" },
  { id: "last_month", label: "الشهر الماضي" },
  { id: "last_3", label: "آخر ٣ أشهر" },
  { id: "year", label: "هذه السنة" },
] as const;

function Achievements() {
  const items = useStore((s) => s.achievements);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState(false);
  const active = FILTERS.find((f) => f.id === filter)!;
  const earned = items.filter((a) => a.earned);
  const locked = items.filter((a) => !a.earned);

  return (
    <Screen>
      <TopBar title="الإنجازات" />
      <Card className="mx-4 bg-gradient-to-br from-primary to-[oklch(0.42_0.2_285)] text-primary-foreground border-transparent">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8" strokeWidth={1.75} />
          <div>
            <div className="text-xs opacity-80">مستواك</div>
            <div className="text-2xl font-black">حارس مالي</div>
          </div>
        </div>
        <div className="mt-3 text-xs opacity-80">
          {earned.length} إنجازات من {items.length} · استمر لتصل إلى المستوى الذهبي
        </div>
      </Card>

      <div className="mb-2 mt-6 flex items-center justify-between px-4">
        <div className="text-sm font-bold">الإنجازات المحقّقة</div>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="tap flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-bold"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
            {active.label}
          </button>
          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  className="absolute left-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setFilter(f.id); setOpen(false); }}
                      className="tap flex w-full items-center justify-between px-3 py-2.5 text-right text-xs hover:bg-muted"
                    >
                      <span className={filter === f.id ? "font-bold text-primary" : ""}>{f.label}</span>
                      {filter === f.id && <Check className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-4 grid grid-cols-2 gap-3">
        {earned.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-elevated p-4 text-center"
          >
            <div className="grid place-items-center text-primary"><IIcon e={a.emoji} className="h-9 w-9" /></div>
            <div className="mt-1 text-sm font-bold">{a.title}</div>
          </motion.div>
        ))}
      </div>

      <SectionTitle>قيد التقدّم</SectionTitle>
      <div className="mx-4 grid grid-cols-2 gap-3">
        {locked.map((a) => (
          <div key={a.id} className="card-elevated p-4 text-center opacity-60">
            <div className="grid place-items-center text-muted-foreground"><IIcon e={a.emoji} className="h-9 w-9" /></div>
            <div className="mt-1 text-sm font-bold">{a.title}</div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
