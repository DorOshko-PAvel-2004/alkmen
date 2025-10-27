import { useDownloadPosition } from "@/hooks/useDownloadPosition";
import { Pill } from "@/components/ui/pill.tsx";

export function PositionDownloadBlock() {
  const { download, isPending } = useDownloadPosition();

  return (
    <div className="w-full flex justify-end">
      <Pill
        className="!py-1 mt-8 hover:bg-brand-purple hover:text-brand-lime !duration-300"
        onClick={() => download()}
        disabled={isPending}
      >
        {isPending ? "загрузка…" : "скачать положение"}
      </Pill>
    </div>
  );
}
