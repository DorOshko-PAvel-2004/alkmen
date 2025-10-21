import { Pill } from "@/components/ui/pill.tsx";
import RelevanceBlock from "@/components/ui/relevance-block.tsx";
import StarIcon from "@/assets/star_icon.svg?url";

export const Score = () => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl text-brand-black font-bold">
        <Pill className="!text-2xl sm:!text-3xl md:!text-4xl !px-4 sm:!px-5 md:!px-6 !py-1 sm:!py-1.5 md:!py-1.5">
          КАК
        </Pill>
        <div>ОЦЕНИВАЮТСЯ</div>
        <div>ПРОЕКТЫ?</div>
      </div>
      <div className="text-brand-gray mt-8">
        Экспертная группа рассматривает проекты по нескольким критериям:
      </div>
      <div className="flex flex-col gap-12 mt-12">
        <RelevanceBlock
          title="АКТУАЛЬНОСТЬ"
          messagePrimary={
            <>
              Почему вы выбрали именно эту проблему? Как она влияет на
              окружающих, университет, отрасль или общество?
            </>
          }
          messageAccent={
            <>
              Почему вы выбрали именно эту проблему? Как она влияет на
              окружающих, университет, отрасль или общество?
            </>
          }
          accent="brand-purple"
          starSrc={StarIcon}
        />
        <RelevanceBlock
          title="новизна"
          messagePrimary={
            <>
              Есть ли у вашей идеи что-то свежее? Это может быть новая функция,
              необычный способ решения, интересная комбинация технологий или
              подходов.
            </>
          }
          messageAccent={
            <>
              Даже если идея не уникальна на 100%, важно показать, чем ваш
              проект отличается от уже существующих или как вы улучшили что-то
              знакомое.
            </>
          }
          accent="brand-lime"
          starSrc={StarIcon}
        />
        <RelevanceBlock
          title="Конкурентоспособность"
          messagePrimary={
            <>
              Чем ваш проект лучше похожих решений? Есть ли у него шанс
              заинтересовать пользователей или быть полезным в реальной жизни?
            </>
          }
          messageAccent={
            <>
              Попробуйте коротко описать преимущества вашего подхода. Это могут
              быть удобство, скорость, стоимость, локализация, простота или
              что-то ещё.
            </>
          }
          accent="brand-purple"
          starSrc={StarIcon}
        />
        <RelevanceBlock
          title="Реалистичность"
          messagePrimary={
            <>
              Можно ли выполнить вашу задумку за отведённое время и с теми
              ресурсами, которые у вас есть?
            </>
          }
          messageAccent={
            <>
              Никто не ждёт невозможного! Главное — чтобы проект был выполнимым.
            </>
          }
          accent="brand-lime"
          starSrc={StarIcon}
        />
        <RelevanceBlock
          title="команда"
          messagePrimary={<>Кто участвует в проекте? Как распределены роли?</>}
          messageAccent={
            <>
              Оценивается не только опыт, но и то, как вы договариваетесь между
              собой, кто за что отвечает и как планируете работать вместе.
            </>
          }
          accent="brand-purple"
          starSrc={StarIcon}
        />
        <RelevanceBlock
          title="презентация"
          messagePrimary={<>Как вы представили свой проект?</>}
          messageAccent={
            <>
              Важно понятно и интересно донести суть идеи до жюри. Не
              обязательно делать сложные слайды — главное, чтобы было ясно, что
              вы хотите сделать, для кого, почему и как.
            </>
          }
          accent="brand-lime"
          starSrc={StarIcon}
        />
      </div>
    </div>
  );
};
