import * as React from "react";
import TitleLogo from "@/assets/title_logo.svg?url";

export interface NewsItemProps {
  title: string;
  text: string;
  img: string;
  href?: string;
  className?: string;
  imageAspectClasses?: string;
  maxTitleChars?: number;
  maxTextChars?: number;
}

function truncateWithEllipsis(value: string, limit: number): string {
  if (!value) return "";
  if (limit <= 0) return value;
  const needsTrim = value.length > limit;
  if (!needsTrim) return value;
  const slice = value.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  const safeSlice = lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice;
  return safeSlice.trimEnd() + "…";
}

const NewsItem = React.forwardRef<HTMLAnchorElement, NewsItemProps>(
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
      <a
        ref={ref}
        href={href}
        className={[
          "group relative border-2 border-brand-purple card py-2 px-3",
          "overflow-hidden flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime",
          "transition-shadow hover:border-brand-lime",
          className,
        ].join(" ")}
        aria-label={`Открыть новость: ${title}`}
      >
        <div
          className={[
            "h-32 sm:h-40 rounded-lg",
            "bg-gray-50",
            "flex items-center justify-center",
            imageAspectClasses,
          ].join(" ")}
        >
          <img
            src={img ? img : TitleLogo}
            alt={title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Контент карточки */}
        <div className="flex-1 flex flex-col mt-3 w-full">
          <h3
            className={[
              "uppercase font-bold text-lg sm:text-xl lg:text-xl text-brand-purple w-full",
              "line-clamp-2",
            ].join(" ")}
            title={title}
          >
            {truncatedTitle}
          </h3>
          <p
            className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-3"
            title={text}
          >
            {truncatedText}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <span
              className="flex-shrink-0 rounded-full bg-brand-lime p-1 group-hover:bg-brand-purple transition-colors"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
                width="52.000000"
                height="52.000000"
                fill="none"
                className="w-4 h-4 sm:w-8 sm:h-8 text-brand-purple group-hover:text-brand-lime"
              >
                <rect
                  id="arrow"
                  width="52.000000"
                  height="52.000000"
                  x="0.000000"
                  y="0.000000"
                />
                <path
                  id="Ellipse 82"
                  d="M52 26C52 40.3594 40.3594 52 26 52C11.6406 52 0 40.3594 0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26Z"
                  fill="rgb(192,231,33)"
                  fill-opacity="0"
                  fill-rule="nonzero"
                />
                <path
                  id="Arrow 3"
                  d="M30 24L33 24L33 28L30 28L30 24ZM30.1716 26L20.2721 16.1005C19.4801 15.3085 19.4801 14.064 20.2721 13.2721C21.064 12.4801 22.3085 12.4801 23.1005 13.2721L34.4142 24.5858C35.2062 25.3777 35.2062 26.6223 34.4142 27.4142L23.1005 38.7279C22.3085 39.5199 21.064 39.5199 20.2721 38.7279C19.4801 37.936 19.4801 36.6915 20.2721 35.8995L30.1716 26Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                />
              </svg>
            </span>
          </div>
        </div>
      </a>
    );
  },
);

NewsItem.displayName = "NewsItem";
export default NewsItem;
