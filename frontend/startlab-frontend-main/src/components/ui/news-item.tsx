import Arrow from "@/assets/arrow.svg?url";
import * as React from "react";
import TitleLogo from "@/assets/title_logo.svg?url";

export interface NewsItemProps {
  /** Заголовок новости */
  title: string;
  /** Краткий текст */
  text: string;
  /** Путь к изображению (например, import img from "...svg?url") */
  img: string;
  /** Ссылка для перехода по карточке/стрелке */
  href?: string;
  /** Дополнительные классы на корневом элементе */
  className?: string;
  /** Управление аспектом изображения (по умолчанию как в макете) */
  imageAspectClasses?: string;
  /** Макс. количество символов в заголовке до обрезки */
  maxTitleChars?: number;
  /** Макс. количество символов в тексте до обрезки */
  maxTextChars?: number;
}

/** Вспом. функция: обрезает строку до N символов с троеточием */
function truncateWithEllipsis(value: string, limit: number): string {
  if (!value) return "";
  if (limit <= 0) return value;
  const needsTrim = value.length > limit;
  if (!needsTrim) return value;
  // Стремимся не резать посреди слова, двигаем влево до ближайшего пробела
  const slice = value.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  const safeSlice = lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice;
  return safeSlice.trimEnd() + "…"; // юникодная многоточие
}

/**
 * Универсальный компонент карточки новости.
 * Стилизован Tailwind-классами, повторяет текущую верстку из NewsPage.
 * Добавлено: обрезка по кол-ву символов + всплывающий бар с полным содержимым по hover/focus.
 */
const NewsItem = React.forwardRef<HTMLElement, NewsItemProps>(
  (
    {
      title,
      text,
      img,
      href = "#",
      className = "",
      imageAspectClasses = "",
      maxTitleChars = 12,
      maxTextChars = 35,
    },
    ref,
  ) => {
    const truncatedTitle = truncateWithEllipsis(title, maxTitleChars);
    const truncatedText = truncateWithEllipsis(text, maxTextChars);

    return (
      <article
        ref={ref}
        className={`group relative border-2 border-brand-purple card py-2 px-3 overflow-hidden flex flex-col ${className}`}
      >
        {/* Изображение */}
        <div className={`${imageAspectClasses} overflow-hidden rounded-lg`}>
          <img
            src={img ? img : TitleLogo}
            alt={title}
            className="max-h-32 w-20 sm:w-28 md:w-36 lg:w-48 xl:w-56 object-contain sm:object-cover"
          />
        </div>

        {/* Контент карточки (с обрезкой по символам) */}
        <div className="flex-1 flex flex-col mt-6 w-full">
          <h3
            className="uppercase font-bold text-lg sm:text-xl lg:text-xl text-brand-purple w-full"
            title={title}
          >
            {truncatedTitle}
          </h3>

          <div className="flex items-center justify-between mt-auto w-full gap-3">
            <p
              className="text-xs sm:text-sm text-gray-600 line-clamp-3 flex-1"
              title={text}
            >
              {truncatedText}
            </p>

            <div className="flex-shrink-0 rounded-full bg-brand-lime p-1 hover:bg-brand-lite-green">
              <a
                href={href}
                className="text-sm font-semibold text-brand-purple hover:underline focus:outline-none focus:ring-2 focus:ring-brand-lime rounded-full"
                aria-label={`Открыть новость: ${title}`}
              >
                <img
                  src={Arrow}
                  alt="стрелка"
                  className="w-4 h-4 sm:w-8 sm:h-8"
                />
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

NewsItem.displayName = "NewsItem";
export default NewsItem;
