import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Screen, Card, SectionTitle } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useStore, setState, resetAll } from "@/lib/store";
import { ChevronLeft, Bell, Lock, Moon, LogOut, Trophy, Settings, UserPlus, ShieldCheck, Circle } from "lucide-react";


export const Route = createFileRoute("/_tabs/profile")({ component: Profile });

function Profile() {
  const s = useStore((x) => x);
  const nav = useNavigate();

  return (
    <Screen>
      <div className="px-5 pt-10 pb-2">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-2xl font-black">
            {s.user.name[0]}
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

      <SectionTitle>الحساب</SectionTitle>
      <List>
        <Row to="/achievements" icon={<Trophy className="h-5 w-5" />} label="الإنجازات" />
        <Row to="/settings" icon={<Settings className="h-5 w-5" />} label="الإعدادات" />
        <Row to="/notifications" icon={<Bell className="h-5 w-5" />} label="الإشعارات" />
        <Row to="/security" icon={<Lock className="h-5 w-5" />} label="الأمان والدخول" />
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
