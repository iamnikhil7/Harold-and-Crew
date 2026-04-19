"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Variant = "primary" | "ghost" | "light";

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "#3D3529",
    color: "#F5F0E8",
    boxShadow: "0 14px 34px rgba(61,53,41,0.28)",
  },
  ghost: {
    background: "transparent",
    color: "var(--muted-deep)",
    border: "1px solid rgba(61,53,41,0.2)",
  },
  light: {
    background: "rgba(255,255,255,0.9)",
    color: "#2C2418",
    border: "1px solid rgba(180,165,140,0.25)",
  },
};

const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
}

/**
 * The Harold & Crew chocolate pill CTA. Same shape, same padding,
 * same arrow on every screen — button or link.
 */
export default function PillButton({
  children,
  href,
  onClick,
  variant = "primary",
  disabled = false,
  arrow = true,
  className = "",
  type = "button",
}: Props) {
  const style: React.CSSProperties = {
    ...styles[variant],
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const inner = (
    <motion.span
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-sm ${className}`}
      style={style}
    >
      {children}
      {arrow && <Arrow />}
    </motion.span>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="block w-full">
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="block w-full"
    >
      {inner}
    </button>
  );
}
