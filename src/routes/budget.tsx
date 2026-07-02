import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Bar } from "@/components/mobile/Ring";
import { useStore, setState, getState, categoryLabel } from "@/lib/store";
import { CategoryIcon } from "@/components/mobile/CategoryIcon";

import { fmtSAR } from "@/lib/format";

export const Route = createFileRoute("/budget")({ component: Budget });

function Budget() {
  const budgets = useStore((s) => s.budgets);

  const update = (cat: string, limit: number) => {
    const b = { ...getState().budgets };
    (b as any)[cat] = { ...(b as any)[cat], limit };
    setState({ budgets: b });
  };

  return (
    <Screen>
      <TopBar title="تعديل الميزانية" />
      <div className="px-4 space-y-3">
        {Object.entries(budgets).map(([cat, b]) => (
          <Card key={cat}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><CategoryIcon category={cat as any} /></div>
                <div>
                  <div className="text-sm font-bold">{categoryLabel(cat as any)}</div>
                  <div className="num text-[11px] text-muted-foreground">{fmtSAR(b.spent)} من {fmtSAR(b.limit)}</div>
                </div>
              </div>
              <input
                type="number" value={b.limit} onChange={(e) => update(cat, Number(e.target.value))}
                className="num h-10 w-24 rounded-xl bg-muted px-3 text-left text-base font-bold outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Bar value={b.spent} max={b.limit} className="mt-2" />
          </Card>
        ))}
      </div>
    </Screen>
  );
}
