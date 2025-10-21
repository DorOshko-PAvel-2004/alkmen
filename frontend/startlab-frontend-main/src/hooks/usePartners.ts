import { useQuery } from "@tanstack/react-query";
import { fetchPartners, PartnerDto } from "@/api/partners";

export function usePartners() {
  return useQuery<PartnerDto[], Error>({
    queryKey: ["partners"],
    queryFn: fetchPartners,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}
