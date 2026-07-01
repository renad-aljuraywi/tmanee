import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, TopBar } from "@/components/mobile/Shell";
import { useStore, categoryIcon, categoryLabel } from "@/lib/store";
import { fmtSAR, fmtDate } from "@/lib/format";
import { useState } from "react";

export const Route = createFileRoute("/transactions")({ component: Transactions });

const FILTERS = ["الكل", "المطاعم", "التسوّق", "الفواتير", "الاشتراكات"] as const;

function Transactions() {
  const tx = useStore((s) => s.transactions);
  const [f, setF] = useState<string>("الكل");

  const filtered = f === "الكل" ? tx : tx.filter(t => categoryLabel(t.category).includes(f.replace("ال", "")) || categoryLabel(t.category) === f);

  const groups = filtered.reduce<Record<string, typeof tx>>((acc, t) => {
    const k = fmtDate(t.date);
    (acc[k] ||= []).push(t);
    return acc;
  }, {});

  return (
    <Screen>
      <TopBar title="جميع العمليات" />
      <div className="sticky top-14 z-20 glass border-b border-border/40 flex gap-2 overflow-x-auto px-4 py-3">
        {FILTERS.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ${f === x ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="px-4 pt-3">
        {Object.entries(groups).map(([day, items]) => (
          <div key={day} className="mb-4">
            <div className="mb-2 text-xs font-bold text-muted-foreground">{day}</div>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {items.map((t) => (
                <Link key={t.id} to="/transaction/$id" params={{ id: t.id }} className="tap flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg">{t.icon || categoryIcon(t.category)}</div>
                    <div>
                      <div className="text-sm font-bold">{t.merchant}</div>
                      <div className="text-[11px] text-muted-foreground">{categoryLabel(t.category)}</div>
                    </div>
                  </div>
                  <div className={`num text-sm font-black ${t.amount < 0 ? "text-danger" : "text-success"}`}>
                    {t.amount < 0 ? "-" : "+"}{fmtSAR(Math.abs(t.amount))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
