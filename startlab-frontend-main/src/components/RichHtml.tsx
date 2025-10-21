import React, { useMemo } from "react";
import DOMPurify from "dompurify";

type Props = {
  html: string;
  className?: string;
};

/**
 * Безопасно рендерим HTML.
 * Профиль "html" вычищает потенциально опасные теги/атрибуты (script/style и т.п.).
 */
export const RichHtml: React.FC<Props> = ({ html, className }) => {
  const safe = useMemo(
    () => ({
      __html: DOMPurify.sanitize(html ?? "", {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["script", "style"],
      }),
    }),
    [html],
  );

  return <div className={className} dangerouslySetInnerHTML={safe} />;
};
