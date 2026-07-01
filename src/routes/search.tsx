import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, TopBar } from "@/components/mobile/Shell";
import { useState, useMemo } from "react";
import { useStore, categoryIcon, categoryLabel } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({ component: Search });

function Search() {
  const tx = useStore((s) => s.transactions);
  const [q, setQ] = useState("");
  const results = useMemo(() => q ? tx.filter(t => t.merchant.includes(q)) : [], [q, tx]);

  return (
    <Screen>
      <TopBar title="بحث" />
      <div className="px-4">
        <div className="relative">
          <SearchIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن متجر، فئة، مبلغ…"
            className="h-14 w-full rounded-2xl border border-border bg-surface pr-12 pl-4 text-base font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {!q && (
          <div className="mt-6">
            <div className="mb-2 text-xs font-bold text-muted-foreground">اقتراحات</div>
            <div className="flex flex-wrap gap-2">
              {["مطاعم", "بنزين", "اشتراكات", "أمازون", "اليوم", "هذا الأسبوع"].map((s) => (
                <button key={s} onClick={() => setQ(s)} className="rounded-full bg-muted px-3 py-1.5 text-xs">{s}</button>
              ))}
            </div>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</div>
        )}

        <div className="mt-4 space-y-2">
          {results.map((t) => (
            <Link key={t.id} to="/transaction/$id" params={{ id: t.id }} className="tap flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg">{t.icon || categoryIcon(t.category)}</div>
                <div>
                  <div className="text-sm font-bold">{t.merchant}</div>
                  <div className="text-[11px] text-muted-foreground">{categoryLabel(t.category)}</div>
                </div>
              </div>
              <div className="num text-sm font-black text-danger">-{fmtSAR(Math.abs(t.amount))}</div>
            </Link>
          ))}
        </div>
      </div>
    </Screen>
  );
}
