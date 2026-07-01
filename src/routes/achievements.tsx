import { createFileRoute } from "@tanstack/react-router";
import { Screen, TopBar, Card, SectionTitle } from "@/components/mobile/Shell";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/achievements")({ component: Achievements });

function Achievements() {
  const items = useStore((s) => s.achievements);
  const earned = items.filter(a => a.earned);
  const locked = items.filter(a => !a.earned);
  return (
    <Screen>
      <TopBar title="الإنجازات" />
      <Card className="mx-4 bg-gradient-to-br from-primary to-[oklch(0.42_0.2_285)] text-primary-foreground border-transparent">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8" />
          <div>
            <div className="text-xs opacity-80">مستواك</div>
            <div className="text-2xl font-black">حارس مالي 🥈</div>
          </div>
        </div>
        <div className="mt-3 text-xs opacity-80">
          {earned.length} إنجازات من {items.length} · استمر لتصل إلى المستوى الذهبي
        </div>
      </Card>

      <SectionTitle>محقّقة</SectionTitle>
      <div className="mx-4 grid grid-cols-2 gap-3">
        {earned.map((a, i) => (
          <motion.div key={a.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="card-elevated p-4 text-center">
            <div className="text-4xl">{a.emoji}</div>
            <div className="mt-1 text-sm font-bold">{a.title}</div>
          </motion.div>
        ))}
      </div>

      <SectionTitle>قيد التقدّم</SectionTitle>
      <div className="mx-4 grid grid-cols-2 gap-3">
        {locked.map((a) => (
          <div key={a.id} className="card-elevated p-4 text-center opacity-60">
            <div className="text-4xl grayscale">{a.emoji}</div>
            <div className="mt-1 text-sm font-bold">{a.title}</div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
