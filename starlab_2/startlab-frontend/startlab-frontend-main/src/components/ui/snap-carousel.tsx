import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Включать слайдер, если элементов больше этого числа */
  threshold?: number;
  ariaLabel?: string;
  className?: string;
  /** Вынести стрелки за пределы слайдера (влево/вправо) */
  arrowsOutside?: boolean;
};

export default function SnapCarousel({
  children,
  threshold = 4,
  ariaLabel,
  className = "",
  arrowsOutside = true,
}: Props) {
  const items = useMemo(() => React.Children.toArray(children), [children]);
  const useSlider = items.length > threshold;

  if (!useSlider) {
    // Сетка 1/2/4 — как и раньше
    return (
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4 " +
          className
        }
      >
        {items}
      </div>
    );
  }

  return (
    <SnapStrip
      ariaLabel={ariaLabel}
      className={className}
      arrowsOutside={arrowsOutside}
    >
      {items}
    </SnapStrip>
  );
}

function SnapStrip({
  children,
  ariaLabel,
  className,
  arrowsOutside = true,
}: {
  children: React.ReactNode[];
  ariaLabel?: string;
  className?: string;
  arrowsOutside?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const eps = 1;
      setCanPrev(el.scrollLeft > eps);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - eps);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  const scrollByPage = (dir: -1 | 1) => () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={"relative overflow-visible " + (className ?? "")}>
      {/* Лента — без вертикального скролла и без полос прокрутки */}
      <div
        ref={viewportRef}
        className="flex overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory scroll-smooth gap-4 sm:gap-6 lg:gap-4 pb-0"
        aria-label={ariaLabel}
      >
        {React.Children.map(children, (child, i) => (
          <div
            className="snap-start shrink-0 basis-[85%] sm:basis-1/2 lg:basis-1/4"
            key={i}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Навигация. Вынес за край контейнера .container-limited отрицательными отступами */}
      <div
        className={
          "pointer-events-none absolute inset-y-0 flex items-center justify-between " +
          (arrowsOutside
            ? " -left-6 -right-6 sm:-left-7 sm:-right-7 md:-left-10 md:-right-10 "
            : " left-0 right-0 ")
        }
      >
        <button
          type="button"
          onClick={scrollByPage(-1)}
          disabled={!canPrev}
          className="pointer-events-auto inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full border border-brand-lime bg-brand-lime text-brand-purple shadow-md hover:bg-brand-purple hover:text-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/60 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Предыдущие элементы"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={scrollByPage(1)}
          disabled={!canNext}
          className="pointer-events-auto inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full border border-brand-lime bg-brand-lime text-brand-purple shadow-md hover:bg-brand-purple hover:text-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/60 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Следующие элементы"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
