import { Pill } from "@/components/ui/pill";
import type { ComponentProps } from "react";
import { Copyable } from "./ui/copyable";

export type CopyableEmailPillProps = {
  email: string;
  copiedText?: string;
  title?: string;
} & Omit<ComponentProps<typeof Pill>, "as" | "onClick" | "children">;

export default function CopyableEmailPill({
  email,
  copiedText = "Скопировано ✓",
  title = "Скопировать email",
  className,
  ...pillProps
}: CopyableEmailPillProps) {
  return (
    <Copyable text={email} ariaLabel={title}>
      {({ copied, copy }) => (
        <Pill
          as="button"
          onClick={copy}
          className={`uppercase w-fit group relative ${className ?? ""}`}
          title={title}
          aria-label={title}
          {...pillProps}
        >
          {copied ? copiedText : email}
        </Pill>
      )}
    </Copyable>
  );
}
