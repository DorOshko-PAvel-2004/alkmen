import type { ReactNode } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function Copyable({
  text,
  timeout,
  children,
  ariaLabel = "Скопировать",
}: {
  text: string;
  timeout?: number;
  ariaLabel?: string;
  children: (args: { copied: boolean; copy: () => void }) => ReactNode;
}) {
  const { copied, copy } = useCopyToClipboard(timeout);
  return (
    <span aria-live="polite" aria-label={ariaLabel}>
      {children({ copied, copy: () => copy(text) })}
    </span>
  );
}
