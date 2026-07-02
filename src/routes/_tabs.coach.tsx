import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Shell";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { simulatePurchase, useStore } from "@/lib/store";
import { fmtSAR } from "@/lib/format";

export const Route = createFileRoute("/_tabs/coach")({ component: Coach });

interface Msg { role: "user" | "ai"; text: string; card?: any; }

const SUGGEST = [
  "هل أقدر أشتري آيفون بـ 4500؟",
  "لماذا أنفقت أكثر هذا الشهر؟",
  "كيف أوفّر 1000 ريال؟",
  "هل أستطيع السفر الشهر القادم؟",
];

function Coach() {
  const s = useStore((x) => x);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `أهلاً ${s.user.name} 👋 أنا منيع. اسألني أي شيء عن راتبك، أهدافك، أو قرارات الشراء.` },
  ]);
  const [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      const priceMatch = q.match(/(\d{2,6})/);
      let text = "";
      let card: any = null;
      if (priceMatch) {
        const amt = Number(priceMatch[1]);
        const sim = simulatePurchase(amt);
        text = `بناءً على وضعك الحالي، شراء بمبلغ ${fmtSAR(amt)} ر.س سيكون له هذا الأثر:`;
        card = { type: "sim", amt, ...sim };
      } else if (q.includes("أوفّر") || q.includes("أوفر")) {
        text = "أهم ثلاث خطوات لتوفير 1000 ر.س هذا الشهر:";
        card = { type: "tips", tips: ["قلّل المطاعم إلى 3 مرات أسبوعياً — توفير ~380 ر.س", "أوقف اشتراكاً واحداً غير مستخدم — توفير ~55 ر.س", "أجّل عمليات شراء بعد الساعة 9 مساءً — توفير ~600 ر.س"] };
      } else if (q.includes("لماذا") || q.includes("أنفقت")) {
        text = "الزيادة هذا الشهر (+12%) تعود بشكل رئيسي إلى فئتَي المطاعم والتسوّق المتأخر. أنماط الشراء بعد الساعة 9 مساءً ارتفعت 34%.";
      } else {
        text = "دعني أفكر… بناءً على أنماطك الحالية، أنصحك بالانتظار حتى منتصف الشهر لأي قرار كبير — سأحضّر لك سيناريو مفصّل إذا شئت.";
      }
      setMsgs((m) => [...m, { role: "ai", text, card }]);
    }, 700);
  };

  return (
    <Screen className="flex flex-col pb-40">
      <div className="sticky top-0 z-20 glass border-b border-border/40 flex items-center gap-3 px-4 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold">اسأل منيع</div>
          <div className="text-[11px] text-success flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> نشِط الآن
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 pt-4">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "flex justify-start" : "flex justify-end"}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-surface border border-border"}`}>
                <div>{m.text}</div>
                {m.card?.type === "sim" && (
                  <div className="mt-3 space-y-2">
                    <Stat label="مؤشر الاستنزاف" value={`+${m.card.burnoutDelta}`} tone="danger" />
                    <Stat label="متبقٍّ من الراتب" value={`${fmtSAR(m.card.remaining)} ر.س`} tone="warning" />
                    <Stat label="تأخّر هدف الادّخار" value={`${m.card.delayMonths} شهر`} tone="warning" />
                  </div>
                )}
                {m.card?.type === "tips" && (
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {m.card.tips.map((t: string, i: number) => <li key={i} className="flex gap-2"><span>•</span>{t}</li>)}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottom} />
      </div>

      {msgs.length <= 1 && (
        <div className="mt-4 space-y-2 px-4">
          <div className="text-xs text-muted-foreground">جرّب أن تسأل:</div>
          {SUGGEST.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="tap w-full rounded-2xl border border-border bg-surface p-3 text-right text-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-32 z-30 mx-auto max-w-md px-3">
        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="glass flex items-center gap-2 rounded-full border border-border p-1.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا…"
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
          />
          <button type="submit" className="tap grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Send className="h-4 w-4 -scale-x-100" />
          </button>
        </form>
      </div>
    </Screen>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-3 py-2 bg-${tone}-soft`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`num font-black text-${tone}`}>{value}</span>
    </div>
  );
}
