import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn } from "@/components/mobile/Btn";
import { TopBar } from "@/components/mobile/Shell";

export const Route = createFileRoute("/auth/forgot")({ component: Forgot });

function Forgot() {
  const nav = useNavigate();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-dvh">
      <TopBar />
      <div className="px-6 pt-4">
        <h1 className="text-2xl font-black">استعادة الوصول</h1>
        <p className="mt-1 text-sm text-muted-foreground">أدخل بريدك وسنرسل رابط الاستعادة.</p>
        {!sent ? (
          <>
            <input
              dir="ltr"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-6 h-14 w-full rounded-2xl border border-border bg-surface px-4 text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Btn full size="lg" className="mt-6" disabled={!email.includes("@")} onClick={() => setSent(true)}>
              إرسال الرابط
            </Btn>
          </>
        ) : (
          <div className="mt-8 rounded-3xl bg-success-soft p-5 text-center">
            <div className="text-4xl">✉️</div>
            <div className="mt-2 font-bold">تم إرسال الرابط</div>
            <p className="mt-1 text-sm text-muted-foreground">تحقّق من بريدك للمتابعة.</p>
            <Btn className="mt-4" onClick={() => nav({ to: "/auth/login" })}>عودة لتسجيل الدخول</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
