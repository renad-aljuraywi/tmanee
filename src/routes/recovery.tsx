import { createFileRoute, Link } from "@tanstack/react-router";
import { IIcon } from "@/components/mobile/IIcon";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { setState, useStore } from "@/lib/store";
import { HeartHandshake, Check } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/recovery")({ component: Recovery });

const MISSIONS = [
  { id: 1, label: "لا مطاعم اليوم", reward: "+50 نقطة" },
  { id: 2, label: "استخدم بدائل أرخص للقهوة", reward: "+30 نقطة" },
  { id: 3, label: "أوقف اشتراكاً واحداً غير مستخدم", reward: "+80 نقطة" },
  { id: 4, label: "امشِ بدل الأوبر لأقل من 3 كم", reward: "+40 نقطة" },
];

function Recovery() {
  const on = useStore((s) => s.recoveryMode);
  return (
    <Screen>
      <TopBar title="وضع التعافي" />
      <Card className="mx-4 !bg-primary-soft border-primary/20">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="font-black">دعنا نأخذ نفَساً</div>
            <div className="text-xs text-muted-foreground">مهمّات صغيرة يومية تعيد التوازن لراتبك.</div>
          </div>
          <Btn size="sm" onClick={() => setState({ recoveryMode: !on })}>{on ? "إيقاف" : "تفعيل"}</Btn>
        </div>
      </Card>

      <SectionTitle>مهمّاتك اليوم</SectionTitle>
      <div className="mx-4 space-y-2">
        {MISSIONS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-border">
                <Check className="h-4 w-4 opacity-30" />
              </div>
              <div>
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-[11px] text-success">{m.reward}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <SectionTitle>بدائل ذكية</SectionTitle>
      <div className="mx-4 grid grid-cols-2 gap-3">
        <Card>
          <div className="text-primary"><IIcon e="☕" className="h-6 w-6" /></div>
          <div className="mt-1 text-sm font-bold">اصنع قهوتك</div>
          <div className="text-[11px] text-muted-foreground">توفير ~180 ر.س / أسبوع</div>
        </Card>
        <Card>
          <div className="text-primary"><IIcon e="🥗" className="h-6 w-6" /></div>
          <div className="mt-1 text-sm font-bold">وجبات منزلية</div>
          <div className="text-[11px] text-muted-foreground">توفير ~350 ر.س / أسبوع</div>
        </Card>
      </div>


      <Link to="/coach" className="mx-4 mt-6 block text-center text-sm font-bold text-primary">اطلب خطة تعافي مخصّصة من الكوتش</Link>
    </Screen>
  );
}
