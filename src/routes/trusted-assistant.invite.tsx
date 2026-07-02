import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { Switch } from "@/components/ui/switch";
import {
  ASSISTANT_PERM_LABELS,
  AssistantPermKey,
  AssistantPerms,
  DEFAULT_ASSISTANT_PERMS,
  RESTRICTED_ASSISTANT_ACTIONS,
  setState,
} from "@/lib/store";
import { Check, Loader2, Lock, Search, ShieldCheck, UserPlus } from "lucide-react";

export const Route = createFileRoute("/trusted-assistant/invite")({ component: Invite });

type Step = "phone" | "found" | "perms" | "sending" | "success";

function maskName(n: string) {
  return n.length <= 2 ? n : n[0] + "•••• " + n[n.length - 1];
}
function maskPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length < 4) return p;
  return "+966 5• ••• ••" + d.slice(-2);
}

function Invite() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<{ name: string; phone: string } | null>(null);
  const [perms, setPerms] = useState<AssistantPerms>(DEFAULT_ASSISTANT_PERMS);

  const doSearch = () => {
    if (phone.replace(/\D/g, "").length < 9) return;
    setSearching(true);
    setTimeout(() => {
      setFound({ name: "سارة العتيبي", phone });
      setSearching(false);
      setStep("found");
    }, 900);
  };

  const doSend = () => {
    setStep("sending");
    setTimeout(() => {
      if (found) {
        setState({
          trustedAssistant: {
            name: found.name,
            phone: maskPhone(found.phone),
            permissions: perms,
            status: "connected",
          },
        });
      }
      setStep("success");
    }, 1400);
  };

  return (
    <Screen>
      <TopBar title="إضافة مساعد موثوق" />

      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="px-4 pt-2"
          >
            <Card>
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <UserPlus className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-bold">ابحث برقم الجوال</div>
                  <div className="mt-1 text-xs leading-6 text-muted-foreground">
                    أدخل رقم الجوال الخاص بالشخص الذي تثق به. لن يتم إرسال الدعوة إلا بعد اختيار الصلاحيات.
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">رقم الجوال</label>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3 focus-within:ring-2 focus-within:ring-primary/25">
                  <span className="num text-sm text-muted-foreground">+966</span>
                  <input
                    dir="ltr"
                    inputMode="tel"
                    placeholder="5• ••• ••••"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="num h-12 w-full bg-transparent text-left text-base font-semibold outline-none"
                  />
                </div>
              </div>

              <Btn full className="mt-4" onClick={doSearch} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Search className="h-4 w-4" strokeWidth={1.75} />}
                {searching ? "جارِ البحث…" : "بحث"}
              </Btn>
            </Card>
          </motion.div>
        )}

        {step === "found" && found && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="px-4 pt-2"
          >
            <Card>
              <div className="text-xs text-muted-foreground">نتيجة البحث</div>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground text-base font-black">
                  {found.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{maskName(found.name)}</div>
                  <div className="num text-[11px] text-muted-foreground">{maskPhone(found.phone)}</div>
                </div>
              </div>
              <div className="mt-3 text-[11px] leading-6 text-muted-foreground">
                لأسباب تتعلق بالخصوصية، نُخفي بيانات المستخدم قبل قبول الدعوة.
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Btn variant="outline" onClick={() => setStep("phone")}>رجوع</Btn>
                <Btn onClick={() => setStep("perms")}>متابعة</Btn>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "perms" && (
          <motion.div
            key="perms"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="px-4 pt-2 space-y-3"
          >
            <Card>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                <div className="text-sm font-bold">الصلاحيات الممنوحة</div>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">اختر ما يمكن للمساعد فعله نيابةً عنك.</div>

              <div className="mt-3 divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {(Object.keys(ASSISTANT_PERM_LABELS) as AssistantPermKey[]).map((k) => (
                  <div key={k} className="flex items-center justify-between p-3.5">
                    <div className="text-sm font-semibold">{ASSISTANT_PERM_LABELS[k]}</div>
                    <Switch
                      checked={perms[k]}
                      onCheckedChange={(v) => setPerms((p) => ({ ...p, [k]: v }))}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-danger/5 border border-danger/20">
              <div className="flex items-center gap-2 text-danger">
                <Lock className="h-4 w-4" strokeWidth={1.75} />
                <div className="text-sm font-bold">غير قابلة للتفويض</div>
              </div>
              <div className="mt-2 space-y-1.5">
                {RESTRICTED_ASSISTANT_ACTIONS.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-[12px] text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] leading-6 text-muted-foreground">
                هذه العمليات محمية دائمًا ولا يمكن تنفيذها إلا من قِبلك بعد التحقق برمز OTP.
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-2 px-1 pt-1">
              <Btn variant="outline" onClick={() => setStep("found")}>رجوع</Btn>
              <Btn onClick={doSend}>إرسال الدعوة</Btn>
            </div>
          </motion.div>
        )}

        {step === "sending" && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center px-4 pt-24 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
              <Loader2 className="h-7 w-7 animate-spin" strokeWidth={1.75} />
            </div>
            <div className="mt-4 text-sm font-bold">جارِ إرسال الدعوة…</div>
            <div className="mt-1 text-xs text-muted-foreground">لن تُفعّل الصلاحيات إلا بعد قبول المساعد.</div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="grid place-items-center px-6 pt-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 340, damping: 18, delay: 0.1 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-glow)]"
            >
              <Check className="h-9 w-9" strokeWidth={2.5} />
            </motion.div>
            <div className="mt-5 text-lg font-black">تم إرسال الدعوة</div>
            <div className="mt-1 max-w-xs text-xs leading-6 text-muted-foreground">
              سيتلقى المساعد الموثوق إشعارًا لقبول الدعوة. ستظهر حالته في صفحة الحساب فور قبوله.
            </div>
            <Btn full className="mt-6 max-w-xs" onClick={() => nav({ to: "/profile" })}>
              العودة إلى الحساب
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
