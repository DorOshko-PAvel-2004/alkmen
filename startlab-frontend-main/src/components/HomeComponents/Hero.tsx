import TitleLogo from "@/assets/title_logo.svg?url";
import { Pill } from "@/components/ui/pill";
import { TrackCard } from "@/components/ui/track-card";

export default function Hero() {
  return (
    <section className="relative pt-6 md:pt-12">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
          <img
            src={TitleLogo}
            alt="СТАРТЛАБ — титульный логотип"
            className="w-full max-w-[20rem] sm:max-w-[28rem] lg:w-[36rem] lg:max-w-none"
          />

          {/* Колонка с лейблами */}
          <div className="w-full lg:w-auto">
            {/* ЕДИНАЯ ШИРИНА для первых трёх лейблов */}
            <div className="space-y-2 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[420px] mx-auto lg:mx-0">
              {/* 1 — слева */}
              <div className="flex justify-start">
                <Pill variant="outline" className="w-[80%]">
                  СТАРТЛАБ БГУИР
                </Pill>
              </div>

              {/* 2 — справа */}
              <div className="flex justify-end">
                <Pill className="w-[80%] !px-12">ЭТО ТОЧКА ВХОДА</Pill>
              </div>

              {/* 3 — слева + ИДЕЙ! в правом нижнем углу */}
              <div className="relative flex justify-start">
                <div className="w-[80%]">
                  <Pill className="w-full">В МИР БОЛЬШИХ</Pill>
                </div>
                <div className="absolute -right-0 sm:right-4 lg:-right-4 -bottom-5 sm:-bottom-8 lg:-bottom-7">
                  <Pill
                    color="purple"
                    className="-rotate-[12deg] w-[6rem] sm:w-[7rem] lg:w-[8rem]"
                  >
                    ИДЕЙ!
                  </Pill>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between sm:justify-between w-full gap-3 sm:gap-5 mt-12 sm:mt-16 md:mt-16">
          <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl">
            <div className="text-brand-black font-bold">ПОДАТЬ</div>
            <div id="apply">
              <Pill className="!text-2xl sm:!text-3xl md:!text-4xl !px-4 sm:!px-5 md:!px-6 !py-1 sm:!py-1.5 md:!py-1.5">
                ЗАЯВКУ
              </Pill>
            </div>
          </div>

          {/* Описание */}
          <div className="text-sm sm:text-base md:text-md text-gray-600 text-center sm:text-left max-w-[48rem] leading-relaxed px-2 sm:px-0">
            Заполни заявку и участвуй в ежегодном конкурсном отборе{" "}
            <b>научных</b> и <b>инновационных</b> идей обучающихся БГУИР.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10">
          <TrackCard
            num="01"
            title="Наука и технологии"
            color="purple"
            withButton={true}
            link="/apply/science"
          >
            Если ты стремишься двигать <b>науку</b> вперёд и создавать будущее,
            а твой проект посвящён <b>исследованиям</b> или новым{" "}
            <b>технологическим решениям</b> — этот трек для тебя!
          </TrackCard>

          <TrackCard
            num="02"
            title="Стартапы и продукты"
            color="green"
            withButton={true}
            link="/apply/startup"
          >
            Если ты хочешь создать собственный продукт, проверить идею в
            реальных условиях и построить <b>успешный стартап</b> —
            присоединяйся к этому треку!
          </TrackCard>
        </div>
      </div>
    </section>
  );
}
