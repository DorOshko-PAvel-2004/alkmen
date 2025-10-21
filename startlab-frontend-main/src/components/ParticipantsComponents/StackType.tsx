import { Pill } from "@/components/ui/pill.tsx";
import { TrackCard } from "@/components/ui/track-card.tsx";

export const StackType = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl text-brand-black font-bold">
        <div>КАК</div>
        <Pill className="!text-2xl sm:!text-3xl md:!text-4xl !px-4 sm:!px-5 md:!px-6 !py-1 sm:!py-1.5 md:!py-1.5">
          ОПРЕДЕЛИТЬ
        </Pill>
        <div>СВОЙ</div>
        <div>ТРЕК?</div>
      </div>
      <div className="text-brand-gray mt-8">
        Если вы не уверены, куда подать проект — вот простой ориентир:
      </div>
      <div className="flex flex-col gap-8 mt-12">
        <TrackCard
          num="01"
          title="Наука и технологии"
          color="purple"
          childrenAfterBLock={
            <div className="flex gap-2 flex-wrap">
              <Pill
                variant="outline"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                ваш проект
              </Pill>
              <Pill
                color="purple"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                тестирование гипотез
              </Pill>
              <Pill
                color="purple"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                эксперименты
              </Pill>
              <Pill
                color="purple"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                научный анализ
              </Pill>
              <Pill
                color="purple"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                разработка новой технологии
              </Pill>
            </div>
          }
        >
          <div className="flex flex-col">
            <div>
              Этот трек для проектов, которые требуют проведения
              исследовательской работы, имеют научную базу или предполагают
              использование университетского оборудования.
            </div>
          </div>
        </TrackCard>

        <TrackCard
          num="02"
          title="Наука и технологии"
          childrenAfterBLock={
            <div className="flex gap-2 flex-wrap">
              <Pill
                variant="outline"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                ваш проект
              </Pill>
              <Pill
                color="green"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                направлен на быстрый выход на рынок
              </Pill>
              <Pill
                color="green"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                создание MVP
              </Pill>
              <Pill
                color="green"
                className="!text-sm !whitespace-normal break-words max-w-full"
              >
                пилотирование и работа с потребителями
              </Pill>
            </div>
          }
        >
          <div className="flex flex-col">
            <div>
              Если ваша цель — создать продукт, протестировать бизнес-идею в
              реальных условиях и сделать первые шаги к запуску собственного
              дела, — это ваш трек.
            </div>
          </div>
        </TrackCard>
      </div>
    </div>
  );
};
