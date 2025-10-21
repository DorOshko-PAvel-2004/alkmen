import { Pill } from "@/components/ui/pill";
import { CustomLi } from "@/components/HomeComponents/Timeline";

export const WhatNext = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 items-center">
        <div className="flex items-center justify-center gap-3">
          <Pill variant="outline">участие</Pill>
          <Pill>в конкурсе</Pill>
        </div>
        <Pill>это</Pill>
        <Pill
          color="purple"
          className="
            rotate-[-10deg]
            -mt-2 ml-0
            md:!-mt-4 md:!ml-24   /* на десктопе остаётся как было */
          "
        >
          только начало!
        </Pill>
      </div>

      <div className="flex items-center sm:gap-3 text-2xl sm:text-3xl md:!text-3xl text-brand-black font-bold mt-20">
        <div>ЧТО</div>
        <Pill className="!text-2xl sm:!text-3xl md:!text-3xl !px-3 sm:!px-4 md:!px-5 !py-3 sm:!py-4 md:!py-0">
          дальше?
        </Pill>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-14 max-w-full">
        <div className="flex flex-col gap-3 md:basis-2/5 max-w-full">
          <div>
            <b>Самые перспективные</b> проекты получают реальную поддержку для
            дальнейшего роста.
          </div>
        </div>

        <div className="max-w-full md:max-w-xl text-xs sm:text-sm md:basis-3/5">
          <div className="space-y-4 sm:space-y-5">
            <CustomLi title="Продолжение работы в лабораториях БГУИР">
              для научных и технологических проектов
            </CustomLi>
            <CustomLi title="Гранты от БГУИР">
              для проектов в области Deep Tech для создания конечного продукта
            </CustomLi>
            <CustomLi title="Присоединяйся">
              к команде единомышленников
            </CustomLi>
            <CustomLi title="Акселерационные программы">
              для стартапов, готовых к выходу на рынок
            </CustomLi>
          </div>
        </div>
      </div>
    </div>
  );
};
