import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { TopBar } from "@/components/mobile/Shell";
import { setState } from "@/lib/store";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

export const Route = createFileRoute("/bank-connect")({ component: BankConnect });

const BANKS = [
  { id: "rjhi", name: "الراجحي", color: "#003399" },
  { id: "snb", name: "الأهلي", color: "#00693C" },
  { id: "riy", name: "الرياض", color: "#E30613" },
  { id: "alb", name: "البلاد", color: "#5C2D91" },
  { id: "sab", name: "SAB", color: "#DB0011" },
  { id: "anb", name: "العربي", color: "#0055A6" },
];

function BankConnect() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
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
          <Lock className="h-3.5 w-3.5" /> اتصال آمن ومشفّر عبر منصّة تمكين
        </div>
        <h1 className="mt-2 text-2xl font-black">اربط حسابك البنكي</h1>
        <p className="mt-1 text-sm text-muted-foreground">اختَر بنكك لبدء تحليل عاداتك المالية.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {BANKS.map((b) => (
            <motion.button
              key={b.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(b.id)}
              className={`relative flex h-24 flex-col items-start justify-between rounded-2xl border-2 p-4 text-right transition ${
                selected === b.id ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <div className="h-8 w-8 rounded-lg" style={{ background: b.color }} />
              <div className="font-bold">{b.name}</div>
              {selected === b.id && (
                <div className="absolute top-2 left-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <button className="mt-6 w-full text-center text-sm text-muted-foreground" onClick={() => nav({ to: "/home" })}>
          تخطّي الآن — سأربط لاحقاً
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 px-6 pb-6">
        <Btn full size="lg" disabled={!selected || loading} onClick={connect}>
          {loading ? "جارٍ الاتصال…" : "متابعة"}
        </Btn>
      </div>
    </div>
  );
}
