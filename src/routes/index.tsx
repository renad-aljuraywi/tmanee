import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import logo from "@/assets/muneea-logo.png.asset.json";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();
  const onboarded = useStore((s) => s.onboarded);
  const authed = useStore((s) => s.authed);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!onboarded) nav({ to: "/onboarding" });
      else if (!authed) nav({ to: "/auth/login" });
      else nav({ to: "/home" });
    }, 1400);
    return () => clearTimeout(t);
  }, [nav, onboarded, authed]);

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[oklch(0.97_0.03_290)] via-[oklch(0.94_0.05_285)] to-[oklch(0.88_0.08_285)] text-foreground">
      <motion.div
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 3.6, repeat: Infinity }}
      />
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        >
          <img src={logo.url} alt="منيع" className="mx-auto h-56 w-56 object-contain drop-shadow-[0_16px_40px_rgba(120,80,220,0.25)]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-4xl font-black text-primary"
        >
          منيع
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          مساعدك المالي الذكي يحميك من الإرهاق
        </motion.p>
      </div>
      <motion.div
        className="absolute bottom-10 h-1 w-32 overflow-hidden rounded-full bg-primary/15"
      >
        <motion.div
          className="h-full w-1/2 bg-primary"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
