import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { ImageIcon, Loader2 } from "lucide-react";
import { useNewsItem } from "@/hooks/useNews";
import { toAbsoluteMediaUrl } from "@/api/news";
import { useParams } from "@tanstack/react-router";

function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setOk(false)}
    />
  ) : (
    <div className={`flex items-center justify-center bg-muted ${className}`}>
      <ImageIcon className="h-8 w-8 opacity-40" />
    </div>
  );
}

export default function ArticlePage() {
  const { newsId } = useParams({ from: "/_basic-layout/news/$newsId/" }) as {
    newsId: string;
  };
  const { data, isLoading, isError, error } = useNewsItem(newsId);

  const dateISO = data?.updated_at ?? data?.created_at;
  const mainImage = useMemo(() => {
    const abs = toAbsoluteMediaUrl(data?.imageUrl ?? data?.image);
    return abs ?? null;
  }, [data?.imageUrl, data?.image]);

  const sanitized = useMemo(() => {
    const dirty = data?.content ?? "";
    return {
      __html: DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } }),
    };
  }, [data?.content]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto w-full max-w-6xl px-4 pt-8 md:pt-12">
        {isLoading ? (
          <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
        ) : isError ? (
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-red-600 md:text-4xl">
            Не удалось загрузить новость: {error?.message}
          </h1>
        ) : (
          <h1 className="uppercase text-2xl font-extrabold leading-tight tracking-tight text-brand-purple md:text-4xl">
            {data?.title}
          </h1>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full px-3 py-1 text-xs md:text-sm">
            Новость
          </span>
          {!isLoading && dateISO && (
            <time
              className="text-xs text-slate-500 md:text-sm"
              dateTime={dateISO}
            >
              {new Date(dateISO).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </header>

      <main className="mx-auto mt-6 w-full max-w-6xl px-4 pb-16 bg-gray-50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          {/* Левая колонка: изображения */}
          <div className="md:col-span-5 lg:col-span-4 mt-12">
            <div className="grid gap-4 md:sticky md:top-6">
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <div className="p-0">
                  {isLoading ? (
                    <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                  ) : mainImage ? (
                    <SafeImage
                      src={mainImage}
                      alt={data?.title ?? "Изображение новости"}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center rounded-2xl bg-slate-100">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: HTML контент */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="rounded-2xl shadow-sm">
              <div className="prose prose-slate max-w-none p-5 sm:p-7 md:p-8">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-9/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-8/12 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : isError ? (
                  <div className="text-sm text-red-600">
                    Произошла ошибка загрузки контента.
                  </div>
                ) : (
                  <article dangerouslySetInnerHTML={sanitized} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-xs text-slate-500">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span></span>
          )}
        </div>
      </main>
    </div>
  );
}
