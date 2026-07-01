import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { setState } from "@/lib/store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/auth/otp")({ component: OTP });

function OTP() {
  const nav = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const filled = otp.every((c) => c.length === 1);

  return (
    <div className="min-h-dvh px-6 pt-14">
      <h1 className="text-2xl font-black">تحقّق من رمز التأكيد</h1>
      <p className="mt-1 text-sm text-muted-foreground">أرسلنا رمزاً مكوّناً من 4 أرقام إلى جوالك.</p>

      <div dir="ltr" className="mt-8 flex justify-center gap-3">
        {otp.map((v, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              const n = [...otp];
              n[i] = val;
              setOtp(n);
              if (val && i < 3) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
            }}
            className="num h-16 w-14 rounded-2xl border-2 border-border bg-surface text-center text-2xl font-black outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
          />
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {seconds > 0 ? (
          <>إعادة الإرسال بعد <span className="num font-bold text-foreground">{seconds}</span> ثانية</>
        ) : (
          <button className="text-primary font-semibold" onClick={() => setSeconds(45)}>إعادة إرسال الرمز</button>
        )}
      </div>

      <motion.div className="mt-10" animate={{ opacity: filled ? 1 : 0.5 }}>
        <Btn full size="lg" disabled={!filled} onClick={() => {
          setState({ authed: true });
          nav({ to: "/bank-connect" });
        }}>
          تأكيد
        </Btn>
      </motion.div>
    </div>
  );
}
