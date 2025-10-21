export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8003";
export type NewsDto = {
  id: number;
  title: string;
  content: string;
  image: string;
  imageUrl: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchNews(): Promise<NewsDto[]> {
  const res = await fetch(`${API_BASE_URL}/news/`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch news: ${res.status} ${text}`);
  }
  const data = (await res.json()) as NewsDto[];
  return data;
}

export async function fetchNewsById(id: string | number): Promise<NewsDto> {
  const res = await fetch(`${API_BASE_URL}/news/${id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch news #${id}: ${res.status} ${text}`);
  }
  return (await res.json()) as NewsDto;
}

export function toAbsoluteMediaUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  try {
    return new URL(pathOrUrl, API_BASE_URL).toString();
  } catch {
    return `${API_BASE_URL}${pathOrUrl}`;
  }
}
