import { Pill } from "@/components/ui/pill";
import StarIcon from "@/assets/star.svg?url";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";

type Props = { type: "science" | "startup" };

export function ThankYouPage({ type }: Props) {
  const { n } = useSearch({ strict: false }) as { n?: string };

  const isScience = type === "science";
  const textBrand = isScience ? "text-brand-purple" : "text-brand-lime";
  const border = isScience ? "border-brand-purple" : "border-brand-lime";
  const category = isScience ? "Наука и технологии" : "Стартапы и продукты";
  const sectionNum = isScience ? "01" : "02";

  // фон теперь НЕ здесь — он из staticData.layoutBg в AppLayout
  return (
    <div className="w-full min-h-[26rem] flex justify-center items-center px-4 sm:px-6 md:px-0">
      <div
        className={clsx(
          // base: mobile-first
          "w-full max-w-5xl mb-8 px-4 sm:px-6 md:px-8 py-4 border-4 rounded-xl bg-white",
          // layout: stack on small screens, row on md+
          "flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0",
          border,
        )}
      >
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xl sm:text-2xl md:!text-3xl">
            <div className="text-brand-black font-bold uppercase leading-tight">
              {n ? `заявка #${n}` : "заявка"}
            </div>
            <Pill className="uppercase !text-base sm:!text-xl md:!text-3xl !px-2 sm:!px-4 md:!px-5 !py-2 sm:!py-3 md:!py-0">
              создана
            </Pill>
          </div>

          <div
            className={clsx(
              // smaller on mobile, preserve original on md+
              "uppercase font-bold mt-2 text-base sm:text-lg md:text-lg",
              textBrand,
            )}
          >
            {category}
          </div>

          <div className="flex items-start gap-2 mt-2">
            <img
              src={StarIcon}
              alt="Картинка звёздочки"
              className="w-4 sm:w-5 shrink-0"
            />
            <div className="text-xs sm:text-sm leading-snug">
              <b>Обязательные</b> поля к заполнению
            </div>
          </div>
        </div>

        {/* Section number: tuck below on mobile, keep big on md+ */}
        <div
          className={clsx(
            "self-end md:self-auto text-5xl sm:text-6xl md:text-[5rem] font-extrabold",
            textBrand,
          )}
        >
          {sectionNum}
        </div>
      </div>
    </div>
  );
}
