import { useMemo } from "react";
import { usePartners } from "@/hooks/usePartners";
import { Pill } from "@/components/ui/pill";
import { toAbsoluteMediaUrl } from "@/api/partners";
import CopyableEmailPill from "@/components/CopyableEmailPill";
import SnapCarousel from "@/components/ui/snap-carousel";

export default function Partners() {
  const { data, isLoading, isError, error } = usePartners();
  const email = "smuofficial@bsuir.by";

  const activePartners = useMemo(
    () => (data ?? []).filter((p: any) => p.is_active),
    [data],
  );

  return (
    <section id="partners" className="py-12 sm:py-16">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:!text-3xl w-full sm:w-[80%] lg:w-[40%] mb-8 sm:mb-10">
          <Pill className="w-full sm:w-auto !text-2xl sm:!text-3xl md:!text-3xl !px-3 sm:!px-4 md:!px-5 !py-0 sm:!py-4 md:!py-0">
            НАШИ
          </Pill>
          <div className="text-center sm:text-left">ПАРТНЁРЫ</div>
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-2 border-brand-green rounded-2xl p-3 animate-pulse bg-muted/30"
              >
                <div className="h-24 sm:h-28 md:h-32 lg:h-36 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Ошибка */}
        {isError && (
          <div className="text-red-600 text-sm">
            Не удалось загрузить партнёров
            {error?.message ? `: ${error.message}` : ""}.
          </div>
        )}

        {/* Список партнёров: сетка (<=4) или слайдер (>4) */}
        {/* Список партнёров: сетка (<=4) или слайдер (>4) */}
        {!isLoading && !isError && activePartners.length > 0 && (
          <SnapCarousel
            threshold={4}
            ariaLabel="Логотипы партнёров"
            className="w-full container-limited" // уважает ваш ограничитель ширины
            arrowsOutside // стрелки за пределами контейнера
          >
            {activePartners.map((p: any) => {
              const logo = toAbsoluteMediaUrl(p.logoUrl);
              return (
                <a
                  key={p.id}
                  href={p.website || "#"}
                  className="block border-2 border-brand-green rounded-2xl p-2 sm:p-3 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-lime/60 hover:border-brand-purple transition"
                  aria-label={`Перейти на страницу партнёра ${p.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="h-24 sm:h-28 md:h-32 lg:h-36 w-full grid place-items-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={p.name}
                        // НИКОГДА не вылезает за рамку + нормированный визуальный размер
                        className="block object-contain max-h-[70%] max-w-[80%]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="px-2 text-center text-sm">{p.name}</div>
                    )}
                  </div>
                </a>
              );
            })}
          </SnapCarousel>
        )}

        {/* Подвал секции */}
        <div className="flex flex-col lg:flex-row items-center mt-12 sm:mt-16 lg:mt-24 justify-center lg:justify-around gap-8 lg:gap-4 px-4">
          {/* Левая часть с пиллами */}
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start">
              <Pill
                variant="outline"
                className="font-bold !border-4 text-sm sm:text-base"
              >
                МЫ
              </Pill>
              <Pill className="text-sm sm:text-base">ВСЕГДА</Pill>
            </div>
            <Pill className="w-[60%] sm:w-auto ml-0 sm:ml-6 text-sm sm:text-base">
              РАДЫ
            </Pill>
            <Pill
              color="purple"
              className="-rotate-[10deg] -mt-2 sm:-mt-4 ml-0 sm:ml-12 text-sm sm:text-base"
            >
              СОТРУДНИЧЕСТВУ!
            </Pill>
          </div>

          {/* Правая часть с текстом и email */}
          <div className="flex flex-col gap-3 items-center text-center lg:text-left max-w-sm lg:max-w-none">
            <div className="text-sm sm:text-base">
              <b>Открыты для обсуждения</b> любого формата взаимодействия.
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <CopyableEmailPill
                email={email}
                className="text-sm sm:text-base lg:text-3xl mx-auto lg:mx-0"
              />
              <span className="sr-only" aria-live="polite">
                Нажмите, чтобы скопировать адрес электронной почты
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
