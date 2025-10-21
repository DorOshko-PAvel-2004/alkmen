export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8003";

export type PartnerDto = {
  id: number;
  name: string;
  description: string;
  title: string;
  website: string | null;
  is_active: boolean;
  logoUrl: string | null; // может быть относительным путём
  created_at: string;
};

export async function fetchPartners(): Promise<PartnerDto[]> {
  const res = await fetch(`${API_BASE_URL}/partners`, {
    method: "GET",
    headers: { Accept: "application/json" },
    // credentials: "include", // если нужны куки/сессии — раскомментируй
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch partners: ${res.status} ${text}`);
  }

  const data = (await res.json()) as PartnerDto[];
  return data;
}

/** Склеиваем абсолютный URL для лого */
export function toAbsoluteMediaUrl(
  pathOrUrl: string | null | undefined,
): string | null {
  if (!pathOrUrl) return null;
  try {
    // если уже абсолютный
    return new URL(pathOrUrl, API_BASE_URL).toString();
  } catch {
    return `${API_BASE_URL}${pathOrUrl}`;
  }
}
