import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Confetti-style celebration overlay
export function Party({ duration = 2000 }: { duration?: number }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration]);
  if (!show) return null;
  const pieces = Array.from({ length: 40 });
  const colors = ["#4F46E5", "#10B981", "#F97316", "#EC4899", "#0EA5E9", "#F59E0B"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const rot = Math.random() * 360;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", rotate: rot + 360, opacity: 0 }}
            transition={{ duration: 2.2, delay, ease: "easeOut" }}
            className="absolute h-3 w-2 rounded-sm"
            style={{ background: color }}
          />
        );
      })}
    </div>
  );
}
