import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { Fingerprint, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-dvh px-6 pt-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground text-2xl">🛡️</div>
        <h1 className="mt-6 text-3xl font-black">أهلاً بك في منيع</h1>
        <p className="mt-1 text-muted-foreground">سجّل الدخول لمتابعة حمايتك المالية.</p>
      </motion.div>

      <div className="mt-8">
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">رقم الجوال</label>
        <div className="relative">
          <Phone className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            dir="ltr"
            type="tel"
            placeholder="5x xxx xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="num h-14 w-full rounded-2xl border border-border bg-surface pr-12 pl-4 text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Btn full size="lg" className="mt-6" onClick={() => nav({ to: "/auth/otp" })} disabled={phone.length < 5}>
        متابعة
      </Btn>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> أو <div className="h-px flex-1 bg-border" />
      </div>

      <Btn variant="outline" full size="lg" onClick={() => nav({ to: "/auth/otp" })}>
        <Fingerprint className="h-5 w-5" /> الدخول ببصمة الوجه / الإصبع
      </Btn>

      <div className="mt-6 text-center text-sm">
        <Link to="/auth/forgot" className="text-primary font-semibold">نسيت كلمة المرور؟</Link>
      </div>

      <p className="mt-10 text-center text-[11px] text-muted-foreground">
        بمتابعتك، فأنت توافق على شروط الاستخدام وسياسة الخصوصية.
      </p>
    </div>
  );
}
