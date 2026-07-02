import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { Btn } from "@/components/mobile/Btn";
import { useStore, setState } from "@/lib/store";
import { User } from "lucide-react";

export const Route = createFileRoute("/profile/edit")({ component: EditProfile });

function EditProfile() {
  const nav = useNavigate();
  const user = useStore((s) => s.user);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const save = () => {
    setState({ user: { ...user, name, phone } });
    nav({ to: "/profile" });
  };

  return (
    <Screen>
      <TopBar title="تعديل الحساب" />
      <div className="px-4 pt-2">
        <div className="flex flex-col items-center py-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-surface border border-border text-foreground">
            <User className="h-10 w-10" strokeWidth={1.75} />
          </div>
          <button className="mt-3 text-xs font-bold text-primary tap">تغيير الصورة</button>
        </div>

        <SectionTitle>المعلومات الشخصية</SectionTitle>
        <Card className="space-y-4">
          <Field label="الاسم" value={name} onChange={setName} />
          <Field label="رقم الجوال" value={phone} onChange={setPhone} dir="ltr" />
        </Card>

        <div className="mt-6 flex gap-2">
          <Btn variant="secondary" onClick={() => nav({ to: "/profile" })} full>إلغاء</Btn>
          <Btn onClick={save} full>حفظ</Btn>
        </div>
      </div>
    </Screen>
  );
}

function Field({ label, value, onChange, dir }: { label: string; value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl" }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-bold text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-bold outline-none focus:border-primary"
      />
    </label>
  );
}
