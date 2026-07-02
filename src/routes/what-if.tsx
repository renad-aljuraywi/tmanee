import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { simulatePurchase, useStore } from "@/lib/store";
import { fmtSAR } from "@/lib/format";
import { Clock, AlertTriangle, Wallet, HeartHandshake, Check } from "lucide-react";

export const Route = createFileRoute("/what-if")({ component: WhatIf });

const RECOVERY_TIPS = [
  { emoji: "☕", label: "اصنع قهوتك بدل الشراء", save: "~180 ر.س / أسبوع" },
  { emoji: "🥗", label: "وجبات منزلية 3 مرات", save: "~350 ر.س / أسبوع" },
  { emoji: "🎧", label: "أوقف اشتراكاً غير مستخدم", save: "~55 ر.س / شهر" },
];

function WhatIf() {
  const nav = useNavigate();
  const currentBurnout = useStore((s) => s.burnoutScore);
  const [amt, setAmt] = useState(4000);
  const [shown, setShown] = useState(false);
  const sim = simulatePurchase(amt);
  const projected = Math.min(100, currentBurnout + sim.burnoutDelta);
  const highRisk = projected >= 60;

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
                <Row icon={<Clock className="h-4 w-4" strokeWidth={1.75} />} label="سيتأخّر هدف الادّخار" value={`${sim.delayMonths} شهر`} tone="warning" />
                <Row icon={<AlertTriangle className="h-4 w-4" strokeWidth={1.75} />} label="سيرتفع مؤشر الخطر" value={`+${sim.burnoutDelta}%`} tone={highRisk ? "danger" : "warning"} />
                <Row icon={<Wallet className="h-4 w-4" strokeWidth={1.75} />} label="المتبقّي آخر الشهر" value={`${fmtSAR(sim.remaining)} ر.س`} tone="warning" />
              </Card>

              {highRisk && (
                <>
                  <SectionTitle>خطة التعافي المقترحة</SectionTitle>
                  <Card className="mx-0 !bg-success-soft border-success/20">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success text-success-foreground">
                        <HeartHandshake className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-success">خطة تعافي سريعة</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">اتبع هذه الخطوات لتقليل الأثر خلال أسبوعين.</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {RECOVERY_TIPS.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          className="flex items-center gap-3 rounded-2xl bg-surface p-3"
                        >
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-success-soft text-success"><IIcon e={t.emoji} className="h-5 w-5" /></div>
                          <div className="flex-1">
                            <div className="text-sm font-bold">{t.label}</div>
                            <div className="text-[11px] text-success">{t.save}</div>
                          </div>
                          <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-border">
                            <Check className="h-3 w-3 opacity-30" strokeWidth={2} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              <Card className="!bg-primary-soft border-primary/20">
                <div className="text-xs text-primary font-bold">نصيحة منيع</div>
                <div className="mt-1 text-sm font-bold leading-relaxed">
                  {highRisk
                    ? `هذا القرار سيرفع مؤشر الاستنزاف إلى ${projected}. أنصحك بتأجيل الشراء حتى منتصف الشهر القادم لتجنّب الضغط المالي.`
                    : sim.delayMonths > 1
                    ? `شراء بمبلغ ${fmtSAR(amt)} ر.س سيؤخّر أهدافك ~${sim.delayMonths} شهر. جرّب تقسيمه على شهرين للحفاظ على توازنك.`
                    : `المبلغ ضمن حدودك الآمنة. تأكد من عدم تكرار عمليات مشابهة هذا الأسبوع.`}
                </div>
                <div className="mt-3 flex gap-2">
                  <Btn variant="secondary" onClick={() => nav({ to: "/burnout" })}>تفاصيل</Btn>
                  <Btn onClick={() => nav({ to: "/coach" })}>اسأل منيع</Btn>
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
