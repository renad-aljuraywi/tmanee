import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card } from "@/components/mobile/Shell";
import { useStore, categoryLabel } from "@/lib/store";
import { CategoryIcon } from "@/components/mobile/CategoryIcon";

import { fmtSAR, fmtDate, fmtTime } from "@/lib/format";
import { MapPin, Repeat, Tag } from "lucide-react";

export const Route = createFileRoute("/transaction/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const t = useStore((s) => s.transactions.find(x => x.id === id));

  if (!t) {
    return (
      <Screen>
        <TopBar title="العملية" />
        <div className="px-6 pt-10 text-center text-muted-foreground">العملية غير موجودة</div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="تفاصيل العملية" />
      <div className="px-4 pt-2">
        <Card className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary"><CategoryIcon category={t.category} className="h-7 w-7" /></div>
          <div className="mt-3 text-sm text-muted-foreground">{t.merchant}</div>
          <div className={`num mt-1 text-4xl font-black ${t.amount < 0 ? "text-danger" : "text-success"}`}>
            {t.amount < 0 ? "-" : "+"}{fmtSAR(Math.abs(t.amount))} <span className="text-base opacity-70">ر.س</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{fmtDate(t.date)} · {fmtTime(t.date)}</div>
        </Card>

        <Card className="mt-3 space-y-3">
          <Row icon={<Tag className="h-4 w-4" />} label="الفئة" value={categoryLabel(t.category)} />
          <Row icon={<MapPin className="h-4 w-4" />} label="الموقع" value="الرياض، حي الملقا" />
          <Row icon={<Repeat className="h-4 w-4" />} label="تكرار محتمل" value="3 مرات هذا الشهر" />
        </Card>

        <Card className="mt-3 !bg-primary-soft border-primary/20">
          <div className="text-xs font-bold text-primary">اكتشاف الذكاء</div>
          <div className="mt-1 text-sm font-bold">تنفق ~180 ر.س شهرياً في {t.merchant}. تقليل زيارة واحدة يوفّر ~60 ر.س.</div>
        </Card>
      </div>
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
