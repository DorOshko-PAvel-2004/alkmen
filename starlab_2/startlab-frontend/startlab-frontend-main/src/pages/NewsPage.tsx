import { useMemo, useState } from "react";
import { Pill } from "@/components/ui/pill";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewsItem from "@/components/ui/news-item.tsx";
import { useNews } from "@/hooks/useNews";
import { toAbsoluteMediaUrl } from "@/api/news";
import { htmlToText } from "@/utils/text";

const ITEMS_PER_PAGE = 8;

export const NewsPage = () => {
  const { data, isLoading, isError, error } = useNews();
  const [currentPage, setCurrentPage] = useState(1);

  const activeNews = useMemo(
    () => (data ?? []).filter((n) => n.is_active),
    [data],
  );
  const totalPages = Math.max(1, Math.ceil(activeNews.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = activeNews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("news")?.scrollIntoView({ behavior: "smooth" });
  };
  const handlePrevPage = () =>
    currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && handlePageChange(currentPage + 1);

  const getVisiblePages = () => {
    const pages: Array<number | "..."> = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= showPages; i++) pages.push(i);
      pages.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...");
      for (let i = totalPages - showPages + 1; i <= totalPages; i++)
        if (i > 0) pages.push(i);
    } else {
      pages.push(1, "...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <section id="news" className="py-12 sm:py-16">
      <div className="px-4 sm:px-6 md:px-8">
        <Pill className="text-2xl sm:text-3xl md:!text-3xl !px-3 sm:!px-4 md:!px-4 !py-3 sm:!py-0 md:!py-0 mb-8 sm:mb-10">
          НОВОСТИ
        </Pill>

        {/* Состояния */}
        {isLoading && (
          <div className="text-sm text-gray-500">Загружаем новости…</div>
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

        {/* Сетка новостей */}
        {activeNews.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
              {currentNews.map((n) => {
                const img =
                  toAbsoluteMediaUrl(n.imageUrl ?? n.image) ?? undefined; // можно подставить плейсхолдер
                const text = htmlToText(n.content ?? "", 120);
                const href = `/news/${n.id}`;

                return (
                  <NewsItem
                    key={n.id}
                    title={n.title}
                    text={text}
                    img={img || ""}
                    href={href}
                  />
                );
              })}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                >
                  <ChevronLeft
                    className={`w-8 h-8 ${
                      currentPage === 1
                        ? "text-brand-gray cursor-not-allowed opacity-50"
                        : "text-brand-lime "
                    }`}
                  />
                </button>

                <div className="flex items-center gap-2">
                  {getVisiblePages().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="text-brand-gray px-2">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${
                            currentPage === page
                              ? "bg-brand-lime text-brand-black"
                              : "hover:bg-gray-100 text-brand-gray/50"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                >
                  <ChevronRight
                    className={`w-8 h-8 ${
                      currentPage === totalPages
                        ? "text-brand-gray cursor-not-allowed opacity-50"
                        : "text-brand-lime "
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
