import { useQuery } from "@tanstack/react-query";
import { FaqDto, fetchFaqs } from "@/api/faqs";

export function useFaqs() {
  return useQuery<FaqDto[], Error>({
    queryKey: ["faqs"],
    queryFn: fetchFaqs,
    select: (rows) => {
      const active = rows.filter((r) => r.is_active);
      active.sort((a, b) => {
        const ao = a.order ?? Number.POSITIVE_INFINITY;
        const bo = b.order ?? Number.POSITIVE_INFINITY;
        if (ao !== bo) return ao - bo;
        const ad = new Date(a.created_at).getTime();
        const bd = new Date(b.created_at).getTime();
        return ad - bd;
      });
      return active;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}
