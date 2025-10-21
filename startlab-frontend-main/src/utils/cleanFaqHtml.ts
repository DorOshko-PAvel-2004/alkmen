// utils/cleanFaqHtml.ts
import DOMPurify from "dompurify";

// Доп. предочистка Word-артефактов
export function normalizeOfficeHtml(html: string) {
  return (
    html
      // убираем <o:p>...</o:p>
      .replace(/<\/?o:p[^>]*>/gi, "")
      // выкидываем Mso-классы
      .replace(/\sclass="[^"]*?Mso[^"]*?"/gi, "")
      // убираем лишние span с lang и пустыми style
      .replace(/<span[^>]*?(lang="[^"]*"|style="\s*")?[^>]*>/gi, "<span>")
      // сжимаем множественные <br>
      .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
      // нормализуем \r\n
      .replace(/\r?\n/g, " ")
  );
}

// Санитизация: разрешаем только безопасные теги и базовые атрибуты.
// ВАЖНО: не разрешаем style/class/lang — чтобы шрифты проекта применились.
export function sanitizeFaqHtml(html: string) {
  const normalized = normalizeOfficeHtml(html);
  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "b",
      "i",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "title", "alt", "src"],
    FORBID_TAGS: ["style", "script"], // на всякий
    FORBID_ATTR: ["style", "class", "lang"], // КЛЮЧЕВОЕ: убираем инлайны
    KEEP_CONTENT: true,
    USE_PROFILES: { html: true },
  });
}
