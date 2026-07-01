import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { simulatePurchase } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { Clock, AlertTriangle, Wallet } from "lucide-react";

export const Route = createFileRoute("/what-if")({ component: WhatIf });

function WhatIf() {
  const nav = useNavigate();
  const [amt, setAmt] = useState(4000);
  const [shown, setShown] = useState(false);
  const sim = simulatePurchase(amt);

  return (
    <Screen>
      <TopBar title="ماذا لو؟" />
      <div className="px-4 pt-2">
        <Card>
          <div className="text-xs text-muted-foreground">أدخل مبلغ الشراء</div>
          <div className="num mt-2 text-center text-4xl font-black">{fmtSAR(amt)}</div>
          <div className="mt-1 text-center text-xs text-muted-foreground">ريال</div>
          <input
            type="range" min={100} max={20000} step={100}
            value={amt}
            onChange={(e) => setAmt(Number(e.target.value))}
            className="mt-5 w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground num">
            <span>20,000</span><span>0</span>
          </div>
          <Btn full size="lg" className="mt-4" onClick={() => setShown(true)}>تحليل التأثير</Btn>
        </Card>

        <AnimatePresence>
          {shown && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <Card>
                <div className="mb-3 text-sm font-bold">النتيجة</div>
                <Row icon={<Clock className="h-4 w-4" />} label="سيتأخّر هدف الادّخار" value={`${sim.delayMonths} شهر`} tone="warning" />
                <Row icon={<AlertTriangle className="h-4 w-4" />} label="سيرتفع مؤشر الخطر" value={`+${sim.burnoutDelta}%`} tone="danger" />
                <Row icon={<Wallet className="h-4 w-4" />} label="المتبقّي آخر الشهر" value={`${fmtSAR(sim.remaining)} ر.س`} tone="warning" />
              </Card>

              <Card className="!bg-primary-soft border-primary/20">
                <div className="text-xs text-primary font-bold">نصيحة الذكاء</div>
                <div className="mt-1 text-sm font-bold">أنصحك بالانتظار حتى منتصف الشهر القادم لتجنّب الضغط المالي.</div>
                <div className="mt-3 flex gap-2">
                  <Btn variant="secondary" onClick={() => nav({ to: "/burnout" })}>تفاصيل</Btn>
                  <Btn onClick={() => nav({ to: "/coach" })}>اسأل الكوتش</Btn>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}

function Row({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`grid h-8 w-8 place-items-center rounded-lg bg-${tone}-soft text-${tone}`}>{icon}</div>
        <div className="text-sm">{label}</div>
      </div>
      <div className={`num text-sm font-black text-${tone}`}>{value}</div>
    </div>
  );
}
