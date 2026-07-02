import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { TopBar } from "@/components/mobile/Shell";
import { setState } from "@/lib/store";
import { motion } from "framer-motion";
import { Check, Lock, ShieldCheck } from "lucide-react";
import alinmaLogo from "@/assets/alinma-logo-navy.jpeg.asset.json";

export const Route = createFileRoute("/bank-connect")({ component: BankConnect });

function BankConnect() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(true);
  const [loading, setLoading] = useState(false);

  const connect = () => {
    setLoading(true);
    setTimeout(() => {
      setState({ bankConnected: true });
      nav({ to: "/home" });
    }, 1600);
  };

  return (
    <div className="min-h-dvh">
      <TopBar />
      <div className="px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} /> اتصال آمن ومشفّر عبر منصّة تمكين
        </div>
        <h1 className="mt-2 text-2xl font-black">اربط حسابك البنكي</h1>
        <p className="mt-1 text-sm text-muted-foreground">سيتم ربط حسابك في بنك الإنماء لبدء تحليل عاداتك المالية.</p>

        {/* Bank */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected(!selected)}
          className={`mt-6 relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-right transition ${
            selected ? "border-primary bg-primary-soft" : "border-border bg-surface"
          }`}
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white border border-border overflow-hidden">
            <img src={alinmaLogo.url} alt="Alinma Bank" className="h-11 w-11 object-contain rotate-[-18deg]" loading="lazy" width={44} height={44} />
          </div>
          <div className="flex-1">
            <div className="font-bold">مصرف الإنماء</div>
            <div className="text-[11px] text-muted-foreground">Alinma Bank</div>
          </div>
          {selected && (
            <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          )}
        </motion.button>

        {/* Mock card preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 rounded-3xl bg-gradient-to-br from-[#6B3F9E] to-[#B084D9] p-5 text-white shadow-[var(--shadow-glow)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] opacity-80">الحساب الجاري</div>
              <div className="num mt-1 text-2xl font-black">SA03 8000 •••• 6080 1017 4519</div>
            </div>
            <div className="text-[11px] font-black">الإنماء</div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] opacity-80">الرصيد المتاح</div>
              <div className="num mt-1 text-3xl font-black">12,480 <span className="text-sm font-bold opacity-80">ر.س</span></div>
            </div>
            <div className="text-left text-[10px] opacity-80">
              <div>صاحب الحساب</div>
              <div className="font-bold">محمد العتيبي</div>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 rounded-2xl bg-success-soft p-3 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="text-[11px] text-success leading-relaxed">
            لن يتمكن منيع من إجراء أي عملية مالية. الوصول للقراءة فقط عبر واجهة البنك الرسمية.
          </div>
        </div>

        <button className="mt-4 w-full text-center text-sm text-muted-foreground" onClick={() => nav({ to: "/home" })}>
          تخطّي الآن — سأربط لاحقاً
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 px-6 pb-6">
        <Btn full size="lg" disabled={!selected || loading} onClick={connect}>
          {loading ? "جارٍ الاتصال بمصرف الإنماء…" : "ربط الحساب"}
        </Btn>
      </div>
    </div>
  );
}
