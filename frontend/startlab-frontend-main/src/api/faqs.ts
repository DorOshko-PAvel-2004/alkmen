export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8003";

export type FaqDto = {
  id: number;
  question: string;
  answer: string;
  order: number | null;
  is_active: boolean;
  image?: string | null;
  imageUrl?: string | null;
  created_at: string;
};

export async function fetchFaqs(): Promise<FaqDto[]> {
  const res = await fetch(`${API_BASE_URL}/faqs/`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch FAQs: ${res.status} ${text}`);
  }
  return (await res.json()) as FaqDto[];
}

export function toAbsoluteMediaUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  try {
    return new URL(pathOrUrl, API_BASE_URL).toString();
  } catch {
    return `${API_BASE_URL}${pathOrUrl}`;
  }
}
