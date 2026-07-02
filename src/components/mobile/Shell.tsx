import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ArrowRight, Home, PieChart, Target, Sparkles, User } from "lucide-react";
import { useStore } from "@/lib/store";
import clsx from "clsx";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      className={clsx("min-h-dvh pb-28", className)}
    >
      {children}
    </motion.div>
  );
}

export function TopBar({
  title,
  back = true,
  right,
  transparent,
}: {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={clsx(
        "sticky top-0 z-30 grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4",
        transparent ? "bg-transparent" : "glass border-b border-border/40",
      )}
    >
      <div className="flex items-center gap-2 justify-self-start">
        {back && (
          <button
            onClick={() => router.history.back()}
            className="tap grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
            aria-label="رجوع"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
        {right}
      </div>
      <div className="text-base font-bold text-center">{title || ""}</div>
      <div />
    </div>
  );
}

const TABS = [
  { to: "/profile", icon: User, label: "حسابي" },
  { to: "/coach", icon: Sparkles, label: "اسأل منيع" },
  { to: "/home", icon: Home, label: "الرئيسية", center: true },
  { to: "/goals", icon: Target, label: "الهدف" },
  { to: "/insights", icon: PieChart, label: "التحليلات" },
] as const;

export function BottomNav() {
  const recovery = useStore((s) => s.recoveryMode);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="relative mx-auto max-w-md">
        <div
          className={clsx(
            "relative flex items-end justify-between border-t border-border/60 bg-surface/95 px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.15)] backdrop-blur",
            recovery && "bg-[color-mix(in_oklab,var(--primary-soft)_60%,white)]",
          )}
        >
          {TABS.map((t) =>
            "center" in t && t.center ? (
              <CenterTab key={t.to} to={t.to} icon={t.icon} label={t.label} />
            ) : (
              <TabLink key={t.to} to={t.to} icon={t.icon} label={t.label} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function TabLink({ to, icon: Icon, label }: { to: string; icon: typeof Home; label: string }) {
  return (
    <Link
      to={to}
      className="tap relative flex flex-1 flex-col items-center gap-1 py-1.5"
      activeProps={{ className: "text-primary" }}
      inactiveProps={{ className: "text-muted-foreground" }}
    >
      <Icon className="h-6 w-6" strokeWidth={1.75} />
      <span className="text-[11px] font-semibold">{label}</span>
    </Link>
  );
}

function CenterTab({ to, icon: Icon, label }: { to: string; icon: typeof Home; label: string }) {
  return (
    <div className="relative flex flex-1 flex-col items-center">
      <Link
        to={to}
        aria-label={label}
        className="tap absolute -top-8 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)] ring-4 ring-surface"
        activeProps={{ className: "" }}
      >
        <Icon className="h-7 w-7" strokeWidth={2} />
      </Link>
    </div>
  );
}

export function Card({ children, className, ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={clsx("card-elevated p-4", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between px-4">
      <div className="text-sm font-bold text-foreground/90">{children}</div>
      {action}
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl bg-surface p-5 pb-8 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
