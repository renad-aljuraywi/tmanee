import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { Fingerprint, KeyRound, Smartphone, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/security")({ component: Security });

function Security() {
  const [bio, setBio] = useState(true);
  const [pin, setPin] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <Screen>
      <TopBar title="الأمان" />
      <Card className="mx-4 !bg-success-soft border-success/20">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground"><Shield className="h-5 w-5" /></div>
          <div>
            <div className="font-black text-success">حسابك محمي</div>
            <div className="text-xs text-muted-foreground">تشفير AES-256 وإخفاء بياناتك محلياً.</div>
          </div>
        </div>
      </Card>

      <SectionTitle>طرق الدخول</SectionTitle>
      <div className="mx-4 divide-y divide-border rounded-2xl border border-border bg-surface">
        <Toggle icon={<Fingerprint className="h-5 w-5" />} label="البصمة / Face ID" on={bio} onChange={setBio} />
        <Toggle icon={<KeyRound className="h-5 w-5" />} label="رمز مرور PIN" on={pin} onChange={setPin} />
        <Toggle icon={<Smartphone className="h-5 w-5" />} label="التحقق بخطوتين (2FA)" on={twoFA} onChange={setTwoFA} />
      </div>

      <SectionTitle>الأجهزة النشطة</SectionTitle>
      <div className="mx-4 rounded-2xl border border-border bg-surface p-4">
        <div className="text-sm font-bold">iPhone 15 Pro · الرياض</div>
        <div className="text-[11px] text-muted-foreground">آخر نشاط الآن — هذا الجهاز</div>
      </div>
    </Screen>
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
