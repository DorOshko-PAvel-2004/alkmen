import { usePartners } from "@/hooks/usePartners";
import { Pill } from "@/components/ui/pill";
import { toAbsoluteMediaUrl } from "@/api/partners";
import CopyableEmailPill from "@/components/CopyableEmailPill";

export default function Partners() {
  const { data, isLoading, isError, error } = usePartners();
  const email = "smuofficial@bsuir.by";
  const top4 = (data ?? []).filter((p: any) => p.is_active).slice(0, 4);

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
          <div className="flex items-center justify-between gap-3 sm:gap-4 w-full lg:w-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-2 border-brand-green rounded-2xl p-2 sm:p-3 lg:w-46 animate-pulse bg-muted/30 h-20 sm:h-24 w-full"
              />
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

        {/* Сетка партнёров */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-between lg:flex lg:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {top4.map((p: any) => {
              const logo = toAbsoluteMediaUrl(p.logoUrl);
              return (
                <a
                  key={p.id}
                  href={p.website || "#"}
                  className="border-2 border-brand-green rounded-2xl p-2 sm:p-3 lg:w-46 focus:outline-none focus:ring-2 focus:ring-brand-green/60 hover:shadow-md transition"
                  aria-label={`Перейти на страницу партнёра ${p.name}`}
                  target="_blank"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={p.name}
                      className="block h-auto max-w-full object-contain w-28 sm:w-36 md:w-48 lg:w-56 xl:w-64 mx-auto md:mx-0"
                    />
                  ) : (
                    <div className="w-40 h-20 flex items-center justify-center text-center text-sm">
                      {p.name}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        )}

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

            {/* Кликабельный Pill с копированием */}
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
