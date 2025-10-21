import { Pill } from "@/components/ui/pill";
import { FC } from "react";

interface TrackCardProps {
  num: string;
  title: string;
  children: React.ReactNode;
  color?: "purple" | "green";
  withButton?: boolean;
  childrenAfterBLock?: React.ReactNode;
  link?: string;
}

export const TrackCard: FC<TrackCardProps> = ({
  num,
  title,
  children,
  color,
  withButton = false,
  childrenAfterBLock,
  link,
}) => {
  return (
    <div
      className={`card flex flex-col gap-4 sm:gap-6 border-2 p-4 sm:p-6 md:px-8 md:py-4
        overflow-hidden sm:overflow-visible
        ${color === "purple" ? "border-brand-purple" : "border-brand-green"}`}
    >
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 min-w-0">
        <div
          className={`font-extrabold flex items-center justify-center text-4xl sm:text-5xl md:text-7xl
            ${color === "purple" ? "text-brand-purple" : "text-brand-green"}`}
        >
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-lg sm:text-xl md:text-2xl font-extrabold uppercase break-words
              ${color === "purple" ? "text-brand-purple" : "text-brand-green"}`}
          >
            {title}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed mt-1">
            {children}
          </div>
        </div>
      </div>

      {/* обёртка, чтобы Pills не вылезали по оси X на узких экранах */}
      {childrenAfterBLock ? (
        <div className="max-w-full overflow-x-hidden">{childrenAfterBLock}</div>
      ) : null}

      {withButton ? (
        <div>
          <a href={link || "/home"} className="text-sm">
            <Pill className="w-full !py-2 !text-base sm:!text-lg !duration-300 !rounded-xl hover:bg-brand-purple hover:text-brand-lime">
              ПОДАТЬ ЗАЯВКУ
            </Pill>
          </a>
        </div>
      ) : null}
    </div>
  );
};
