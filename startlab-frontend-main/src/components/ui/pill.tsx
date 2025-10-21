import React, { FC } from "react";

interface PillProps {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  color?: "green" | "purple";
  className?: string;
  /** When provided, Pill renders as a <button> with proper a11y. */
  onClick?: () => void;
  /** Force element type if needed */
  as?: "div" | "button";
  disabled?: boolean;
  title?: string;
}

export const Pill: FC<PillProps> = ({
  children,
  variant = "solid",
  color = "green",
  className = "",
  onClick,
  title = "title",
  as,
  disabled,
}) => {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-0 sm:px-6 md:px-8 " +
    "text-lg sm:text-xl md:text-2xl font-bold leading-none tracking-tight border-4 select-none uppercase";

  const styles =
    variant === "outline"
      ? "bg-white text-brand-purple border-brand-purple !border-2"
      : color === "green"
        ? "bg-brand-green text-brand-purple border-transparent"
        : "bg-brand-purple text-brand-green border-transparent";

  const interactive = onClick || as === "button";
  const interactiveStyles = interactive
    ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 transition"
    : "";

  const Comp: any = as ? as : interactive ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${interactiveStyles} ${className}`}
      aria-disabled={disabled || undefined}
      type={Comp === "button" ? "button" : undefined}
    >
      {children}
    </Comp>
  );
};
