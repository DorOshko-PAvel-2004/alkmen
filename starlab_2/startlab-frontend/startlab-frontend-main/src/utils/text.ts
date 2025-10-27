import DOMPurify from "dompurify";

/**
 * Превращает HTML в безопасный plain-text и обрезает по maxLen.
 * Используем DOMPurify с пустыми ALLOWED_TAGS/ALLOWED_ATTR, чтобы вычистить всё.
 */
export function htmlToText(html: string, maxLen = 120): string {
  const cleaned = DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  // Декодируем HTML-сущности и получаем plain-text
  const tmp = document.createElement("div");
  tmp.innerHTML = cleaned;
  const text = tmp.textContent || tmp.innerText || "";

  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}
