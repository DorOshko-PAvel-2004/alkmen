import React from "react";

/**
 * RelevanceBlock (Актуальность)
 *
 * UI-компонент как на скриншоте: заголовок с иконкой звезды,
 * затем два "сообщения"-карточки. Цвет второй карточки настраивается.
 *
 * Tailwind: ожидаются кастомные цвета brand-lime и brand-purple
 * (например, в theme.extend.colors). Если в вашей дизайн-системе
 * используются другие токены, просто скорректируйте классы в accentMap.
 */

export type RelevanceBlockProps = {
  /** Текст тайтла (например, "АКТУАЛЬНОСТЬ") */
  title: string;
  /** Текст первого сообщения (светлый блок) */
  messagePrimary: React.ReactNode;
  /** Текст второго сообщения (яркий блок) */
  messageAccent: React.ReactNode;
  /** Цвет второго сообщения */
  accent?: "brand-lime" | "brand-purple";
  /** Путь к иконке звезды (star.svg в проекте) */
  starSrc?: string;
  /** Дополнительные классы для корневого контейнера */
  className?: string;
};

const accentMap: Record<NonNullable<RelevanceBlockProps["accent"]>, string> = {
  "brand-lime": "bg-brand-lime",
  "brand-purple": "bg-brand-purple text-white",
};

export default function RelevanceBlock({
  title,
  messagePrimary,
  messageAccent,
  accent = "brand-purple",
  starSrc = "/star.svg",
  className,
}: RelevanceBlockProps) {
  const accentClasses = accentMap[accent] ?? accentMap["brand-purple"];

  return (
    <section
      className={"w-full" + (className ? ` ${className}` : "")}
      aria-label={title}
    >
      {/* Header */}
      <header className="flex items-center gap-3 mb-4 flex-wrap px-1">
        <img src={starSrc} alt="" className="h-6 w-6 select-none" aria-hidden />
        <div className="text-xl sm:text-2xl text-brand-purple font-semibold tracking-wide uppercase break-words">
          {title}
        </div>
      </header>

      {/* Сообщения */}
      <div className="flex flex-col gap-3">
        <div className="max-w-xl rounded-2xl bg-gray-100 p-4 text-gray-800 shadow-sm">
          {messagePrimary}
        </div>
        <div className="flex justify-end">
          <div
            className={"max-w-xl rounded-2xl p-4 shadow-sm " + accentClasses}
          >
            {messageAccent}
          </div>
        </div>
      </div>
    </section>
  );
}
