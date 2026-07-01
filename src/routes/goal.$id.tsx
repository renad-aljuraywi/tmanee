import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { Bar } from "@/components/mobile/Ring";
import { useStore } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { motion } from "framer-motion";
import { useState } from "react";
import { Party } from "@/components/mobile/Party";

export const Route = createFileRoute("/goal/$id")({ component: GoalDetail });

function GoalDetail() {
  const { id } = Route.useParams();
  const goal = useStore((s) => s.goals.find(g => g.id === id));
  const [showParty, setShowParty] = useState(false);
  if (!goal) return <Screen><TopBar /><div className="p-6 text-center text-muted-foreground">الهدف غير موجود</div></Screen>;
  const pct = Math.round((goal.saved / goal.target) * 100);
  const remaining = goal.target - goal.saved;
  const months = Math.ceil(remaining / goal.monthly);

  return (
    <Screen>
      <TopBar title="تفاصيل الهدف" />
      {showParty && <Party />}
      <div className="px-4 pt-2">
        <Card className="!p-0 overflow-hidden">
          <div className="relative h-56 grid place-items-center" style={{ background: `color-mix(in oklab, ${goal.color} 18%, white)` }}>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">{goal.emoji}</motion.div>
          </div>
          <div className="p-5">
            <div className="text-sm text-muted-foreground">هدف</div>
            <div className="text-2xl font-black">{goal.name}</div>
            <div className="num mt-1 text-4xl font-black" style={{ color: goal.color }}>{pct}%</div>
            <Bar value={goal.saved} max={goal.target} color={goal.color} className="mt-3" />
            <div className="num mt-2 text-xs text-muted-foreground">{fmtSAR(goal.saved)} / {fmtSAR(goal.target)} ريال</div>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Card className="!p-3 text-center">
            <div className="text-[11px] text-muted-foreground">إذا ادّخرت شهرياً</div>
            <div className="num mt-0.5 text-xl font-black">{fmtSAR(goal.monthly)}</div>
          </Card>
          <Card className="!p-3 text-center">
            <div className="text-[11px] text-muted-foreground">ستحقّق هدفك بعد</div>
            <div className="num mt-0.5 text-xl font-black" style={{ color: goal.color }}>{months} شهر</div>
          </Card>
        </div>

        <Card className="mt-3 !p-3">
          <div className="text-[11px] text-muted-foreground">المتبقّي</div>
          <div className="num mt-0.5 text-xl font-black">{fmtSAR(remaining)} ريال</div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Btn variant="outline">تعديل الهدف</Btn>
          <Btn onClick={() => setShowParty(true)}>إضافة إلى الهدف</Btn>
        </div>
      </div>
    </Screen>
  );
}
