import React, {useContext, useId, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Pill} from "@/components/ui/pill.tsx";

/**
 * AccordionGroup + ExpandableItem (one-open-only, robust)
 *
 * ✔ В группе одновременно может быть открыт только один таб
 * ✔ Работает даже если <ExpandableItem/> НЕ являются прямыми детьми группы (обёрнуты в <div/>, <> и т.п.)
 * ✔ Клик по открытому табу — закрывает его (может быть всё закрыто)
 * ✔ Контролируемый/неконтролируемый режим у группы (openIndex/onOpenIndexChange или defaultOpenIndex)
 * ⚠️ Внутри группы локальные props айтема (open/defaultOpen) игнорируются — состояние централизовано.
 */

function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

// -------------------- Context --------------------

type AccordionCtx = {
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  registerItem: () => number; // выдаёт индекс для айтема при первом рендере
};

const AccordionContext = React.createContext<AccordionCtx | null>(null);

// -------------------- ExpandableItem --------------------

export type ExpandableItemProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode; // видна в шапке
  media?: string;
  isButton?: boolean; // КНОПКА ПОД subtitle (в шапке)
  partnerLink?: string;
  children?: React.ReactNode; // основной разворачиваемый контент
  /**
   * Ниже — локальные props. ВНЕ группы работают как прежде.
   * ВНУТРИ группы игнорируются (состояние управляет группа через контекст).
   */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  notUpperCase?: boolean;
};

export function ExpandableItem({
  title,
  subtitle,
  media,
  isButton = false,
  partnerLink,
  children,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  className,
  notUpperCase,
}: ExpandableItemProps) {
  const ctx = useContext(AccordionContext);
  const id = useId();

  // Индекс айтема в группе, назначается один раз при первом рендере
  const idxRef = useRef<number | null>(null);
  if (ctx && idxRef.current === null) {
    idxRef.current = ctx.registerItem();
  }

  // Режим: внутри группы (контекст) или автономно
  const inGroup = !!ctx && idxRef.current !== null;

  // Автономный режим
  const [uncontrolledOpen, setUncontrolledOpen] = useState(!!defaultOpen);
  const localOpen = controlledOpen ?? uncontrolledOpen;

  // Истинное состояние открытости
  const open = inGroup ? ctx!.activeIndex === idxRef.current : localOpen;

  const setOpen = (next: boolean) => {
    if (inGroup) {
      // Групповой контроль: переключаем активный индекс
      ctx!.setActiveIndex(next ? idxRef.current! : null);
      onOpenChange?.(next);
    } else {
      // Локальный контроль
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    }
  };

  return (
    <div
      className={`bg-brand-gray2 first:rounded-t-xl last:rounded-b-xl py-6 ${
        open ? "border-b-0 bg-white" : "border-b border-brand-green"
      } `}
    >
      <motion.div
        className={cn(className)}
        animate={{
          backgroundColor: open ? "#ffffff" : "rgba(255,255,255,0)",
          borderRadius: open ? "1rem" : "0rem",
          padding: open ? "0.5rem" : "0rem",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* HEADER: медиа, заголовок, сабтайтл и КНОПКА ПОД сабтайтлом */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-content`}
          className="w-full text-left"
        >
          <div className="px-3 sm:px-4 py-0 sm:py-0 flex items-center justify-between">
            <div className="min-w-0">
              <h3
                className={`font-semibold text-brand-purple text-lg sm:text-xl md:text-2xl truncate ${
                  notUpperCase ? "" : "uppercase"
                }`}
              >
                {title}
              </h3>
            </div>

            <span className="grid place-items-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border  text-brand-purple bg-brand-lime hover:bg-brand-purple hover:text-brand-lime flex-shrink-0">
              <motion.svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: open ? -90 : 90 }}
                transition={{ duration: 0.25 }}
              >
                <path d="M8 4l8 8-8 8" />
              </motion.svg>
            </span>
          </div>
        </button>

        {/* BODY: разворачиваемый контент */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${id}-content`}
              role="region"
              aria-labelledby={`${id}-title`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 px-3 sm:px-4 pb-4 sm:pb-6 text-xs sm:text-sm leading-relaxed">
                <div className="flex items-center gap-12">
                  {media ? (
                    <div className="border-2 border-brand-green rounded-2xl p-4 sm:p-5 lg:w-60">
                      <img src={media} alt="logo" />
                    </div>
                  ) : (
                    <div />
                  )}
                  <div className="flex flex-col w-full">
                    {subtitle && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-800 leading-snug">
                        {subtitle}
                      </div>
                    )}
                    {isButton && (
                      <div className="flex w-full justify-end mt-4">
                        <a href={partnerLink} target="_blank" className="">
                          <Pill className="!text-lg uppercase !rounded-lg">
                            сайт партнёра
                          </Pill>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className={isButton ? "mt-8" : ""}></div>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// -------------------- AccordionGroup --------------------

export type AccordionGroupProps = {
  children: React.ReactNode;
  className?: string;
  /** Изначально открытый индекс; null — все закрыты */
  defaultOpenIndex?: number | null;
  /** Контролируемый индекс открытого таба */
  openIndex?: number | null;
  /** Колбэк при смене открытого таба */
  onOpenIndexChange?: (index: number | null) => void;
};

export function AccordionGroup({
  children,
  className,
  defaultOpenIndex = null,
  openIndex: controlledIndex,
  onOpenIndexChange,
}: AccordionGroupProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState<number | null>(
    defaultOpenIndex ?? null,
  );
  const activeIndex = controlledIndex ?? uncontrolledIndex;

  const setActiveIndex = (idx: number | null) => {
    if (controlledIndex === undefined) setUncontrolledIndex(idx);
    onOpenIndexChange?.(idx);
  };

  const counterRef = useRef(0);
  counterRef.current = 0;
  const registerItem = () => counterRef.current++;

  return (
    <AccordionContext.Provider
      value={{ activeIndex, setActiveIndex, registerItem }}
    >
      <section className={cn("", className)}>{children}</section>
    </AccordionContext.Provider>
  );
}
