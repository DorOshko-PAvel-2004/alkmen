import { Pill } from "../ui/pill";
import ArrowIcon from "@/assets/right_arrow.svg?url";
import CopyableEmailPill from "@/components/CopyableEmailPill.tsx";

export const Footer = () => {
  return (
    <div
      className="
        flex items-center justify-between
        md:flex-col md:gap-10 md:items-center md:justify-between
        lg:flex-row
        flex-col gap-4   /* мобильная колонка, на md — как было */
      "
    >
      {/* левая группа */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <Pill variant="outline">остались</Pill>
          <Pill>вопросы</Pill>
        </div>
        <Pill>пишите</Pill>

        {/* на десктопе сохраняем прежние оффсеты; на мобилке — без сильного смещения */}
        <Pill
          color="purple"
          className="
            rotate-[-10deg]
            -mt-3              /* мобильный лёгкий подъём */
            md:!-mt-6 md:!ml-[10rem]  /* как было на твоём текущем разрешении */
          "
        >
          на email!
        </Pill>
      </div>

      {/* стрелка — на мобилке просто даём небольшой отступ сверху */}
      <div className="p-2 rounded-full bg-brand-lime mt-2 md:mt-0">
        <img src={ArrowIcon} alt="Стрелка" className="w-6 h-6" />
      </div>

      {/* email — справа на десктопе; по центру и на новой строке на мобилке */}
      <div className="mt-2 md:mt-0">
        <CopyableEmailPill
          email="smuofficial@bsuir.by"
          className="text-sm sm:text-base lg:text-3xl mx-auto lg:mx-0"
        />
      </div>
    </div>
  );
};
