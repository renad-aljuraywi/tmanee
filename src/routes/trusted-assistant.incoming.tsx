import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import {
  ASSISTANT_PERM_LABELS,
  AssistantPermKey,
  setState,
  useStore,
} from "@/lib/store";
import { Check, ShieldCheck, X } from "lucide-react";

export const Route = createFileRoute("/trusted-assistant/incoming")({ component: Incoming });

function Incoming() {
  const nav = useNavigate();
  const invite = useStore((x) => x.incomingInvite);
  const [decision, setDecision] = useState<null | "accept" | "reject">(null);

  if (!invite && !decision) {
    return (
      <Screen>
        <TopBar title="الدعوة" />
        <div className="px-4 pt-6 text-sm text-muted-foreground">لا توجد دعوات حالية.</div>
      </Screen>
    );
  }

  const accept = () => {
    setState({ incomingInvite: null });
    setDecision("accept");
  };
  const reject = () => {
    setState({ incomingInvite: null });
    setDecision("reject");
  };

  return (
    <Screen>
      <TopBar title="دعوة مساعد موثوق" />
      <AnimatePresence mode="wait">
        {decision === null && invite && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="px-4 pt-2 space-y-3"
          >
            <Card>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground text-base font-black">
                  {invite.fromName[0]}
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">دعوة واردة من</div>
                  <div className="text-sm font-bold">{invite.fromName}</div>
                  <div className="num text-[11px] text-muted-foreground">{invite.fromPhone}</div>
                </div>
              </div>
              <div className="mt-3 rounded-2xl bg-primary-soft p-3 text-[12px] leading-6 text-primary">
                يطلب منك أن تكون مساعده الموثوق داخل تطبيق منيع. راجع الصلاحيات قبل القبول.
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <div className="text-sm font-bold">الصلاحيات الممنوحة لك</div>
              </div>
              <div className="mt-3 divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {(Object.keys(ASSISTANT_PERM_LABELS) as AssistantPermKey[]).map((k) => (
                  <div key={k} className="flex items-center justify-between p-3.5">
                    <div className="text-sm font-semibold">{ASSISTANT_PERM_LABELS[k]}</div>
                    {invite.permissions[k] ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-success">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> مسموح
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <X className="h-3.5 w-3.5" strokeWidth={2.5} /> غير مسموح
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] leading-6 text-muted-foreground">
                لا تستطيع تنفيذ العمليات الحساسة (تغيير كلمة المرور، رقم الجوال، حذف الحساب، الحساب البنكي).
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-2 px-1 pt-1">
              <Btn variant="outline" onClick={reject}>رفض</Btn>
              <Btn onClick={accept}>قبول الدعوة</Btn>
            </div>
          </motion.div>
        )}

        {decision === "accept" && (
          <motion.div
            key="accept"
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
            <div className="mt-5 text-lg font-black">تم قبول الدعوة</div>
            <div className="mt-1 max-w-xs text-xs leading-6 text-muted-foreground">
              أنت الآن مساعد موثوق. سيتم إشعار صاحب الحساب بذلك.
            </div>
            <Btn full className="mt-6 max-w-xs" onClick={() => nav({ to: "/profile" })}>
              حسناً
            </Btn>
          </motion.div>
        )}

        {decision === "reject" && (
          <motion.div
            key="reject"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid place-items-center px-6 pt-20 text-center"
          >
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted text-muted-foreground">
              <X className="h-9 w-9" strokeWidth={2.5} />
            </div>
            <div className="mt-5 text-lg font-black">تم رفض الدعوة</div>
            <Btn full className="mt-6 max-w-xs" onClick={() => nav({ to: "/profile" })}>
              العودة
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
