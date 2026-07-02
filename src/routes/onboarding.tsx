import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { setState } from "@/lib/store";
import { Check } from "lucide-react";
import onboardingHero from "@/assets/onboarding-hero.jpeg.asset.json";
import onboardingBrain from "@/assets/onboarding-brain.jpeg.asset.json";
import onboardingAssistant from "@/assets/onboarding-assistant.jpeg.asset.json";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const SLIDES = [
  {
    image: onboardingHero.url,
    title: "احمِ نفسك من الإرهاق المالي",
    body: "منيع يراقب سلوكك المالي بذكاء ويحذّرك قبل أن يتأثر راتبك.",
    color: "oklch(0.85 0.07 290)",
  },
  {
    image: onboardingBrain.url,
    title: "افهم عاداتك، لا أرقامك",
    body: "بدل الجداول المملة، نحوّل بياناتك إلى قصص وقرارات واضحة.",
    color: "oklch(0.85 0.07 290)",
  },
  {
    image: onboardingAssistant.url,
    title: "مساعد ذكي في جيبك",
    body: "اسأل: هل أقدر أشتري آيفون؟ نجاوبك بأثر حقيقي على راتبك وأهدافك.",
    color: "oklch(0.85 0.07 290)",
  },
];

function Onboarding() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [step, setStep] = useState<"intro" | "profile">("intro");
  const [salary, setSalary] = useState(12000);
  const [fixed, setFixed] = useState(4200);
  const [loans, setLoans] = useState(800);
  const [goal, setGoal] = useState(3000);

  if (step === "profile") {
    return (
      <div className="min-h-dvh px-6 pt-12">
        <div className="text-sm text-muted-foreground">الخطوة 2 من 2</div>
        <h1 className="mt-1 text-2xl font-black">ابنِ ملفك المالي</h1>
        <p className="mt-1 text-sm text-muted-foreground">هذه المعلومات تبقى على جهازك وتُستخدم لبناء توصياتك.</p>

        <div className="mt-6 space-y-4">
          <Field label="راتبك الشهري (ريال)" value={salary} onChange={setSalary} />
          <Field label="مصاريف ثابتة" value={fixed} onChange={setFixed} />
          <Field label="أقساط وقروض" value={loans} onChange={setLoans} />
          <Field label="هدف ادّخار شهري" value={goal} onChange={setGoal} />
        </div>

        <div className="mt-8">
          <Btn full size="lg" onClick={() => {
            setState({ onboarded: true, salary, fixed, loans, savingsGoal: goal });
            nav({ to: "/auth/login" });
          }}>
            ابدأ الآن
          </Btn>
          <button className="mt-3 w-full py-3 text-sm text-muted-foreground" onClick={() => setStep("intro")}>رجوع</button>
        </div>
      </div>
    );
  }

  const S = SLIDES[i];

  return (
    <div className="flex min-h-dvh flex-col px-6 pt-8">
      <div className="flex justify-end">
        <button className="text-sm text-muted-foreground" onClick={() => setStep("profile")}>تخطّي</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col items-center"
          >
            <img src={S.image} alt="" className="mb-2 h-auto w-full max-w-[320px] object-contain" loading="eager" />
            <h1 className="mt-8 max-w-xs text-2xl font-black leading-tight">{S.title}</h1>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{S.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mb-8 flex justify-center gap-2">
        {SLIDES.map((_, idx) => (
          <motion.div
            key={idx}
            animate={{ width: idx === i ? 24 : 8, opacity: idx === i ? 1 : 0.4 }}
            className="h-2 rounded-full bg-primary"
          />
        ))}
      </div>
      <Btn full size="lg" onClick={() => {
        if (i < SLIDES.length - 1) setI(i + 1);
        else setStep("profile");
      }}>
        {i < SLIDES.length - 1 ? "التالي" : "لنبدأ"}
      </Btn>
      <div className="h-6" />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="num h-14 w-full rounded-2xl border border-border bg-surface px-4 text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
