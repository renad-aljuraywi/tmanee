import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

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
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-primary text-primary-foreground">
      <motion.div
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 3.6, repeat: Infinity }}
      />
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-white/15 backdrop-blur-xl"
        >
          <span className="text-5xl">🛡️</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-4xl font-black"
        >
          منيع
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm"
        >
          مساعدك المالي الذكي يحميك من الإرهاق
        </motion.p>
      </div>
      <motion.div
        className="absolute bottom-10 h-1 w-32 overflow-hidden rounded-full bg-white/20"
      >
        <motion.div
          className="h-full w-1/2 bg-white"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
