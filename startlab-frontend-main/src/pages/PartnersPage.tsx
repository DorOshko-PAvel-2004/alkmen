import { Pill } from "@/components/ui/pill.tsx";
import { AccordionGroup, ExpandableItem } from "@/components/ui/accordion.tsx";
import { usePartners } from "@/hooks/usePartners";
import { toAbsoluteMediaUrl } from "@/api/partners";
import { RichHtml } from "@/components/RichHtml";
import CopyableEmailPill from "@/components/CopyableEmailPill.tsx";

export const PartnersPage = () => {
  const { data, isLoading, isError, error } = usePartners();

  return (
    <section id="partners" className="py-12 sm:py-16">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-4 px-4">
        <div className="flex flex-col gap-12 ">
          <div className="flex items-center gap-5 h-full">
            <div className="text-4xl font-semibold">НАШИ</div>
            <Pill className="!text-4xl">ПАРТНЁРЫ</Pill>
          </div>
          <div className="text-lg text-brand-black">
            <b>С гордостью</b> представляем компании-партнеры нашего проекта,
            надеемся на продолжение продуктивного сотрудничества.
          </div>
        </div>

        {/* Правая часть с пиллами */}
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
      </div>

      <div className="flex items-center gap-8 text-center lg:text-left max-w-sm lg:max-w-none my-16">
        <CopyableEmailPill
          email="smuofficial@bsuir.by"
          className="text-sm sm:text-base lg:text-2xl mx-auto lg:mx-0"
        />
        <div className="text-sm sm:text-base">
          <b>Открыты для обсуждения</b> любого формата <br />
          взаимодействия.
        </div>
      </div>

      {/* Состояния загрузки/ошибки */}
      {isLoading && (
        <div className="text-sm text-gray-500 px-4">Загружаем партнёров…</div>
      )}
      {isError && (
        <div className="text-sm text-red-600 px-4">
          Не удалось загрузить партнёров: {error?.message}
        </div>
      )}

      {data && (
        <AccordionGroup defaultOpenIndex={0}>
          {data
            .filter((p) => p.is_active)
            .map((p) => {
              const media = toAbsoluteMediaUrl(p.logoUrl) ?? undefined;
              const partnerLink = p.website ?? undefined;

              return (
                <ExpandableItem
                  key={p.id}
                  title={p.name}
                  subtitle={<RichHtml html={p.title ?? ""} />}
                  media={media}
                  isButton={Boolean(partnerLink)}
                  partnerLink={partnerLink}
                  notUpperCase={true}
                >
                  <RichHtml html={p.description ?? ""} />
                </ExpandableItem>
              );
            })}
        </AccordionGroup>
      )}
    </section>
  );
};
