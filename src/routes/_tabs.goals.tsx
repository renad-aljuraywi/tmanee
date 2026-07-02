import { createFileRoute, Link } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, Card, SectionTitle } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_tabs/goals")({ component: Goals });

function Goals() {
  const goals = useStore((s) => s.goals);
  const total = goals.reduce((a, g) => a + g.saved, 0);
  const target = goals.reduce((a, g) => a + g.target, 0);

  return (
    <Screen>
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black">أهدافي</h1>
          <p className="text-sm text-muted-foreground">تخيّل مستقبلك يتحقق قطعة قطعة.</p>
        </div>
        <Link to="/goal/new" className="tap grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <Card className="mx-4 mt-3 bg-gradient-to-br from-primary to-[oklch(0.42_0.2_285)] text-primary-foreground border-transparent">
        <div className="text-xs opacity-80">مجموع الادّخار</div>
        <div className="num mt-1 text-3xl font-black">{fmtSAR(total)} <span className="text-base opacity-80">/ {fmtSAR(target)} ر.س</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(total / target) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-white"
          />
        </div>
      </Card>

      <SectionTitle>الأهداف النشطة</SectionTitle>
      <div className="space-y-3 px-4">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          const months = Math.ceil((g.target - g.saved) / g.monthly);
          return (
            <Link key={g.id} to="/goal/$id" params={{ id: g.id }}>
              <Card className="tap overflow-hidden !p-0">
                <div className="relative h-32 grid place-items-center" style={{ background: `color-mix(in oklab, ${g.color} 12%, white)` }}>
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-primary"
                  >
                    <IIcon e={g.emoji} className="h-14 w-14" />
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 h-1 bg-black/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full"
                      style={{ background: g.color }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold">{g.name}</div>
                    <div className="num text-lg font-black" style={{ color: g.color }}>{pct}%</div>
                  </div>
                  <div className="num mt-1 text-xs text-muted-foreground">
                    {fmtSAR(g.saved)} / {fmtSAR(g.target)} ر.س · متبقٍّ ~{months} شهر
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </Screen>
  );
}
