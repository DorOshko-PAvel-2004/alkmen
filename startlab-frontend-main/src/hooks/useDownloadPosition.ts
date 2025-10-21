import { useMutation } from "@tanstack/react-query";

type DownloadOpts = {
  /** Перезаписать имя файла (если не придёт из заголовка) */
  filename?: string;
  /** Пробросить fetch-опции (заголовки, авторизация и т.п.) */
  fetchInit?: RequestInit;
};

function getFilenameFromHeaders(headers: Headers) {
  const cd = headers.get("content-disposition") || "";
  // content-disposition: attachment; filename="foo.pdf"; filename*=UTF-8''foo.pdf
  const matchQuoted = cd.match(/filename\*?=(?:UTF-8''|")(.*?)(?:\"|;|$)/i);
  if (matchQuoted?.[1]) {
    try {
      // filename* может быть URL-encoded
      return decodeURIComponent(matchQuoted[1]);
    } catch {
      return matchQuoted[1];
    }
  }
  return null;
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8003";

async function fetchPositionDocument(init?: RequestInit) {
  const res = await fetch(API_BASE_URL + "/documents/position", {
    method: "GET",
    credentials: "include", // если куки/сессия — оставьте, иначе можно убрать
    ...init,
    headers: {
      Accept: "*/*",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Download failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`,
    );
  }

  const blob = await res.blob();
  const filename = getFilenameFromHeaders(res.headers);
  const contentType =
    res.headers.get("content-type") || blob.type || "application/octet-stream";

  return { blob, filename, contentType };
}

/**
 * Хук для скачивания "положения" с бэка.
 * Вызовите `download()` по клику.
 */
export function useDownloadPosition(defaults?: DownloadOpts) {
  const mutation = useMutation({
    mutationKey: ["download-position"],
    mutationFn: async (opts?: DownloadOpts) => {
      const merged: DownloadOpts = { ...(defaults || {}), ...(opts || {}) };
      const { blob, filename, contentType } = await fetchPositionDocument(
        merged.fetchInit,
      );

      // имя файла: приоритет — явное, затем из заголовка, иначе дефолт
      const name =
        merged.filename ||
        filename ||
        // попытка угадать расширение по content-type
        (contentType.includes("pdf") ? "position.pdf" : "position.bin");

      // создать ссылку и кликнуть
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      // очистка
      a.remove();
      URL.revokeObjectURL(url);

      return { name, contentType, size: blob.size };
    },
  });

  return {
    download: (opts?: DownloadOpts) => mutation.mutate(opts),
    ...mutation,
  };
}
