import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, Card, SectionTitle, Sheet } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useStore, setState, resetAll } from "@/lib/store";
import { ChevronLeft, Bell, Lock, Moon, LogOut, Trophy, Settings, UserPlus, ShieldCheck, Circle, User, HeartHandshake, Check } from "lucide-react";
import { IIcon } from "@/components/mobile/IIcon";
import { motion } from "framer-motion";



export const Route = createFileRoute("/_tabs/profile")({ component: Profile });

function Profile() {
  const s = useStore((x) => x);
  const nav = useNavigate();

  return (
    <Screen>
      <div className="px-5 pt-10 pb-2">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-surface border border-border text-foreground">
            <User className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xl font-black">{s.user.name}</div>
            <div className="text-xs text-muted-foreground">{s.user.phone}</div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        <Stat label="ادّخار" value={`${s.savedThisMonth}`} sub="ريال / شهر" />
        <Stat label="أهداف" value={`${s.goals.length}`} sub="نشطة" />
        <Stat label="إنجازات" value={`${s.achievements.filter(a => a.earned).length}`} sub={`/ ${s.achievements.length}`} />
      </div>

      <SectionTitle>وضع التعافي</SectionTitle>
      <div className="mx-4">
        <RecoveryModeSection />
      </div>

      <SectionTitle>المساعد الموثوق</SectionTitle>
      <div className="mx-4">
        <TrustedAssistantCard />
      </div>


      <SectionTitle>الحساب</SectionTitle>
      <List>
        <Row to="/achievements" icon={<Trophy className="h-5 w-5" strokeWidth={1.75} />} label="الإنجازات" />
        <Row to="/settings" icon={<Settings className="h-5 w-5" strokeWidth={1.75} />} label="الإعدادات" />
        <Row to="/notifications" icon={<Bell className="h-5 w-5" strokeWidth={1.75} />} label="الإشعارات" />
        <Row to="/security" icon={<Lock className="h-5 w-5" strokeWidth={1.75} />} label="الأمان والدخول" />
      </List>


      <SectionTitle>التجربة</SectionTitle>
      <List>
        <Toggle
          icon={<Moon className="h-5 w-5" strokeWidth={1.75} />}
          label="الوضع الداكن"
          on={s.darkMode}
          onChange={(v) => setState({ darkMode: v })}
        />
      </List>

      <SectionTitle>عن منيع</SectionTitle>
      <List>
        <button
          className="tap flex w-full items-center justify-between p-4 text-danger"
          onClick={() => { resetAll(); nav({ to: "/" }); }}
        >
          <div className="flex items-center gap-3"><LogOut className="h-5 w-5" /> تسجيل الخروج وإعادة التطبيق</div>
        </button>
      </List>
      <div className="px-5 py-6 text-center text-[11px] text-muted-foreground">إصدار 1.0.0 · صُنع بحُبّ 🤍</div>
    </Screen>
  );
}

function TrustedAssistantCard() {
  const ta = useStore((x) => x.trustedAssistant);
  const invite = useStore((x) => x.incomingInvite);
  const activePerms = ta ? Object.values(ta.permissions).filter(Boolean).length : 0;
  const [confirmRemove, setConfirmRemove] = useState(false);


  return (
    <div className="space-y-3">
      {invite && !ta && (
        <Link to="/trusted-assistant/incoming" className="tap block rounded-2xl border border-primary/30 bg-primary-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-primary/80">دعوة جديدة</div>
              <div className="text-sm font-bold text-primary">{invite.fromName} دعاك كمساعد موثوق</div>
            </div>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      )}

      {!ta ? (
        <Card>
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">المساعد الموثوق</div>
              <div className="mt-1 text-xs leading-6 text-muted-foreground">
                أضف شخصًا تثق به لمساعدتك في استخدام التطبيق وفق الصلاحيات التي تحددها.
              </div>
            </div>
          </div>
          <Link to="/trusted-assistant/invite" className="mt-4 block">
            <Btn full variant="primary">
              <UserPlus className="h-4 w-4" strokeWidth={1.75} />
              إضافة مساعد موثوق
            </Btn>
          </Link>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground text-lg font-black">
              {ta.name[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{ta.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Circle className="h-2 w-2 fill-muted-foreground text-muted-foreground" strokeWidth={0} />
                <span>متصل · {ta.phone}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground">
            الصلاحيات النشطة: <span className="font-bold text-foreground">{activePerms}</span> من 7
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/trusted-assistant/permissions">
              <Btn full variant="secondary" size="sm">تعديل الصلاحيات</Btn>
            </Link>
            <Btn full variant="outline" size="sm" onClick={() => setConfirmRemove(true)}>
              إزالة المساعد
            </Btn>
          </div>
        </Card>
      )}

      <Sheet open={confirmRemove} onClose={() => setConfirmRemove(false)}>
        <div className="text-center">
          <div className="text-base font-black">إزالة المساعد الموثوق؟</div>
          <div className="mt-1 text-xs text-muted-foreground">سيتم إلغاء جميع الصلاحيات فورًا.</div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Btn variant="outline" onClick={() => setConfirmRemove(false)}>إلغاء</Btn>
          <Btn
            variant="danger"
            onClick={() => {
              setState({ trustedAssistant: null });
              setConfirmRemove(false);
            }}
          >
            نعم، إزالة
          </Btn>
        </div>
      </Sheet>

    </div>
  );
}


function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="text-center !p-3">
      <div className="num text-2xl font-black">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </Card>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <div className="mx-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">{children}</div>;
}

function Row({ to, icon, label }: { to: any; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="tap flex items-center justify-between p-4">
      <div className="flex items-center gap-3"><span className="text-muted-foreground">{icon}</span><span className="text-sm font-semibold">{label}</span></div>
      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function Toggle({ icon, label, on, onChange }: { icon: React.ReactNode; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="flex w-full items-center justify-between p-4" onClick={() => onChange(!on)}>
      <div className="flex items-center gap-3"><span className="text-muted-foreground">{icon}</span><span className="text-sm font-semibold">{label}</span></div>
      <div className={`relative h-7 w-12 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
        <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "right-0.5" : "right-[calc(100%-1.625rem)]"}`} />
      </div>
    </button>
  );
}

const RECOVERY_MISSIONS = [
  { id: 1, label: "لا مطاعم اليوم", reward: "+50 نقطة" },
  { id: 2, label: "استخدم بدائل أرخص للقهوة", reward: "+30 نقطة" },
  { id: 3, label: "أوقف اشتراكاً واحداً غير مستخدم", reward: "+80 نقطة" },
  { id: 4, label: "امشِ بدل الأوبر لأقل من 3 كم", reward: "+40 نقطة" },
];

function RecoveryModeSection() {
  const on = useStore((x) => x.recoveryMode);
  return (
    <div className="space-y-3">
      <Card className="!bg-primary-soft border-primary/20">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <div className="font-black text-sm">دعنا نأخذ نفَساً</div>
            <div className="text-[11px] text-muted-foreground">مهمّات صغيرة يومية تعيد التوازن لراتبك.</div>
          </div>
          <Btn size="sm" onClick={() => setState({ recoveryMode: !on })}>{on ? "إيقاف" : "تفعيل"}</Btn>
        </div>
      </Card>

      <div className="text-xs font-bold px-1 pt-1">مهمّاتك اليوم</div>
      <div className="space-y-2">
        {RECOVERY_MISSIONS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-border">
                <Check className="h-4 w-4 opacity-30" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-bold">{m.label}</div>
                <div className="text-[11px] text-success">{m.reward}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-xs font-bold px-1 pt-1">بدائل ذكية</div>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-primary"><IIcon e="☕" className="h-6 w-6" /></div>
          <div className="mt-1 text-sm font-bold">اصنع قهوتك</div>
          <div className="text-[11px] text-muted-foreground">توفير ~180 ر.س / أسبوع</div>
        </Card>
        <Card>
          <div className="text-primary"><IIcon e="🥗" className="h-6 w-6" /></div>
          <div className="mt-1 text-sm font-bold">وجبات منزلية</div>
          <div className="text-[11px] text-muted-foreground">توفير ~350 ر.س / أسبوع</div>
        </Card>
      </div>
    </div>
  );
}

