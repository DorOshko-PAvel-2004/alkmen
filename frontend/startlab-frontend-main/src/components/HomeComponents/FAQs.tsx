import { AccordionGroup, ExpandableItem } from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/useFaqs";
import { toAbsoluteMediaUrl } from "@/api/faqs";
import { htmlToText } from "@/utils/text";
import { sanitizeFaqHtml } from "@/utils/cleanFaqHtml.ts";

export default function FAQs() {
  const { data, isLoading, isError, error } = useFaqs();

  return (
    <section id="participants" className="py-12 sm:py-16">
      <div className="">
        <AccordionGroup className="bg-brand-gray2 rounded-xl">
          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`sk-${idx}`} className="px-4 py-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 mb-3" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 mb-2" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            ))}

          {/* Error state */}
          {isError && (
            <div className="px-4 py-3 text-sm text-red-600">
              Не удалось загрузить FAQ: {error?.message}
            </div>
          )}

          {/* Data */}
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
                  <div key={item.id} id={`faq-${item.id}`}>
                    <ExpandableItem
                      title={`/${n} ${titleText}`}
                      defaultOpen={idx === 0}
                      media={media}
                      subtitle={
                        <article
                          className="prose prose-slate max-w-none !text-sm !sm:text-lg"
                          dangerouslySetInnerHTML={safeAnswer}
                        />
                      }
                    ></ExpandableItem>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-brand-gray">
                Пока нет активных вопросов.
              </div>
            ))}
        </AccordionGroup>
      </div>
    </section>
  );
}
