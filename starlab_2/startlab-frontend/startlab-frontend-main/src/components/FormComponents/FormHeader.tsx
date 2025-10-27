import StarIcon from "@/assets/star.svg?url";
import { Pill } from "@/components/ui/pill";
import React from "react";

type FormHeaderProps = {
  color?: "lime" | "purple";
  category: string;
  sectionNumber: string | number;
};

export const FormHeader: React.FC<FormHeaderProps> = ({
  color = "purple",
  category,
  sectionNumber,
}) => {
  const isLime = color === "lime";
  const borderColor = isLime ? "border-brand-lime" : "border-brand-purple";
  const accentText = isLime ? "text-brand-lime" : "text-brand-purple";

  return (
    <div
      className={`
        mb-8 border-4 ${borderColor} rounded-xl
        /* мобильная компоновка */
        flex flex-col gap-4 px-4 py-3
        /* на md и выше — как было */
        md:flex-row md:items-center md:justify-between md:gap-0 md:px-8 md:py-4
      `}
    >
      {/* левая колонка */}
      <div className="flex flex-col min-w-0">
        {/* CTA — размеры как на прошлых страницах */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:!text-3xl">
            <div className="text-brand-black font-bold">ПОДАТЬ</div>
            <Pill className="!text-2xl sm:!text-3xl md:!text-3xl !px-3 sm:!px-4 md:!px-5 !py-2.5 sm:!py-3 md:!py-0">
              ЗАЯВКУ
            </Pill>
          </div>
        </div>

        <div
          className={`uppercase font-bold mt-2 break-words
            text-base sm:text-lg md:text-lg ${accentText}
          `}
        >
          {category}
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-2">
          <img
            src={StarIcon}
            alt="Картинка звёздочки"
            className="w-4 h-4 sm:w-4 sm:h-4"
          />
          <div className="text-sm">
            <b>Обязательные</b> поля к заполнению
          </div>
        </div>
      </div>

      {/* номер секции — уменьшен на мобильных, на md — как было */}
      <div
        className={`
          ${accentText} font-extrabold leading-none self-end
          text-[3rem] sm:text-[3.5rem] md:text-[5rem]
          md:self-auto md:flex-shrink-0
        `}
      >
        {sectionNumber}
      </div>
    </div>
  );
};
