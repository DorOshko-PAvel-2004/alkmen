import { useQuery } from "@tanstack/react-query";
import { fetchNews, fetchNewsById, NewsDto } from "@/api/news";

export function useNews() {
  return useQuery<NewsDto[], Error>({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}

export function useNewsItem(id: string | number | undefined) {
  return useQuery<NewsDto, Error>({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(String(id)),
    enabled: id !== undefined && id !== null,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}
