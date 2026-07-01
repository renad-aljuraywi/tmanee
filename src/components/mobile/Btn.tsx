import clsx from "clsx";
import { forwardRef } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const V: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95",
  secondary: "bg-primary-soft text-primary hover:bg-primary/10",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-danger text-danger-foreground hover:opacity-95",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};
const S: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
};

export const Btn = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; full?: boolean }>(
  function Btn({ className, variant = "primary", size = "md", full, children, ...rest }, ref) {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tap disabled:opacity-40 disabled:pointer-events-none",
          V[variant], S[size], full && "w-full",
          className,
        )}
        {...(rest as any)}
      >
        {children}
      </motion.button>
    );
  }
);
