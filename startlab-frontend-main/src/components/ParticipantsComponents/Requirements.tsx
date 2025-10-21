import Arrow from "@/assets/right_arrow.svg?url";
import { Pill } from "@/components/ui/pill";
import { AccordionGroup, ExpandableItem } from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/useFaqs";
import { toAbsoluteMediaUrl } from "@/api/faqs";
import { htmlToText } from "@/utils/text";
import { PositionDownloadBlock } from "@/components/ParticipantsComponents/PositionDownloadBlock.tsx";
import { sanitizeFaqHtml } from "@/utils/cleanFaqHtml.ts";

export function Requirements() {
  const { data, isLoading, isError, error } = useFaqs();

  return (
    <section id="requirements" className="py-12 sm:py-16 w-full">
      <div className="">
        {/* ваш заголовок */}
        <div className="flex flex-col ">
          <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-2">
              <Pill variant="outline">основные</Pill>
              <Pill>требования</Pill>
            </div>
            <Pill>к</Pill>
            <Pill
              color="purple"
              className="relative !-mt-2 !ml-[4rem] -rotate-[10deg] pr-8"
            >
              проектам
              <span
                className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2
                           rounded-full bg-brand-lime p-2
                           flex items-center justify-center rotate-[100deg]"
              >
                <img src={Arrow} alt="Иконка стрелки" className="w-5" />
              </span>
            </Pill>
          </div>
        </div>

        <AccordionGroup className="bg-brand-gray2 rounded-xl mt-16">
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`sk-${idx}`} className="px-4 py-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 mb-3" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 mb-2" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            ))}

          {/* Error state — как в FAQs */}
          {isError && (
            <div className="px-4 py-3 text-sm text-red-600">
              Не удалось загрузить FAQ: {error?.message}
            </div>
          )}

          {!isLoading &&
            !isError &&
            (data?.length ? (
              data.map((item, idx) => {
                const n = String(idx + 1).padStart(2, "0");
                const titleText = htmlToText(item.question, 140);
                const media =
                  toAbsoluteMediaUrl(item.imageUrl ?? item.image) ?? undefined;

                const safeAnswer = {
                  __html: sanitizeFaqHtml(item.answer ?? ""),
                };

                return (
                  <div key={item.id} id={`req-${item.id}`}>
                    <ExpandableItem
                      title={`/${n} ${titleText}`}
                      defaultOpen={idx === 0}
                      media={media}
                      subtitle={
                        <article
                          className="prose prose-slate max-w-none text-xs sm:text-sm"
                          dangerouslySetInnerHTML={safeAnswer}
                        />
                      }
                    />
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-brand-gray">
                Пока нет активных вопросов.
              </div>
            ))}
        </AccordionGroup>

        <div className="w-full flex justify-end">
          <PositionDownloadBlock />
        </div>
      </div>
    </section>
  );
}
