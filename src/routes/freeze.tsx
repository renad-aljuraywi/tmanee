import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Btn } from "@/components/mobile/Btn";
import { Ring } from "@/components/mobile/Ring";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/freeze")({ component: Freeze });

function Freeze() {
  const nav = useNavigate();
  const [t, setT] = useState(60);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);

  return (
    <div className="relative min-h-dvh bg-black/70">
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="fixed inset-x-3 bottom-3 top-16 flex flex-col justify-between rounded-3xl bg-surface p-6 shadow-2xl"
      >
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-black">قبل تكمل…</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            لاحظنا أنك قمت بـ <b>3 عمليات شراء خلال ساعة</b>. هل تريد الانتظار دقيقة والتفكير مرة أخرى؟
          </p>

          <div className="mt-6 grid place-items-center">
            <Ring value={60 - t} max={60} size={160} stroke={12} color="var(--primary)" track="var(--muted)">
              <div className="text-center">
                <div className="num text-4xl font-black">{t}</div>
                <div className="text-xs text-muted-foreground">ثانية</div>
              </div>
            </Ring>
          </div>

          <div className="mt-4 rounded-2xl bg-warning-soft p-3 text-xs text-warning-foreground">
            هذه العملية سترفع مؤشر الاستنزاف <b>+8</b> وقد تؤخّر هدف السيارة <b>~1 شهر</b>.
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Btn full size="lg" disabled={t > 0} onClick={() => nav({ to: "/home" })}>
            {t > 0 ? `انتظر ${t} ثانية` : "متابعة الآن"}
          </Btn>
          <Btn variant="outline" full onClick={() => nav({ to: "/what-if" })}>مراجعة الأثر</Btn>
          <button className="w-full py-3 text-sm text-muted-foreground" onClick={() => nav({ to: "/home" })}>إلغاء العملية</button>
        </div>
      </motion.div>
    </div>
  );
}
