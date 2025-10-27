import { useMemo } from "react";
import { Pill } from "@/components/ui/pill";
import NewsItem from "@/components/ui/news-item.tsx";
import { useNews } from "@/hooks/useNews";
import { toAbsoluteMediaUrl } from "@/api/news";
import { htmlToText } from "@/utils/text";

export default function News() {
  const { data, isLoading, isError, error } = useNews();

  const activeNews = useMemo(
    () => (data ?? []).filter((n) => n.is_active),
    [data],
  );

  const topNews = useMemo(() => {
    const list = (data ?? []).filter((n) => n.is_active);
    list.sort((a, b) => {
      const da = new Date(a.updated_at ?? a.created_at).getTime();
      const db = new Date(b.updated_at ?? b.created_at).getTime();
      return db - da;
    });
    return list.slice(0, 4);
  }, [data]);

  return (
    <section id="news" className="py-12 sm:py-16">
      <div className="px-4 sm:px-6 md:px-8">
        <Pill className="text-2xl sm:text-3xl md:!text-3xl !px-3 sm:!px-4 md:!px-4 !py-3 sm:!py-0 md:!py-0 mb-8 sm:mb-10">
          НОВОСТИ
        </Pill>

        {/* Состояния */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl shadow-sm p-4">
                <div className="aspect-[4/3] w-full animate-pulse bg-slate-200 rounded-xl mb-3" />
                <div className="h-4 w-3/4 animate-pulse bg-slate-200 rounded mb-2" />
                <div className="h-4 w-5/6 animate-pulse bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-sm text-red-600">
            Не удалось загрузить новости: {error?.message}
          </div>
        )}

        {!isLoading && !isError && activeNews.length === 0 && (
          <div className="text-sm text-brand-gray">
            Пока нет активных новостей.
          </div>
        )}

        {!isLoading && !isError && topNews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
            {topNews.map((n) => (
              <NewsItem
                key={n.id}
                title={n.title}
                text={htmlToText(n.content ?? "", 120)}
                img={toAbsoluteMediaUrl(n.imageUrl ?? n.image) ?? ""}
                href={`/news/${n.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
