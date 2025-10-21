import StarIcon from "@/assets/star_icon.svg?url";
import { Pill } from "@/components/ui/pill.tsx";
import RightArrow from "@/assets/right_arrow.svg?url";

const dates = [
  { title: "До 17 октября", text: "Подача заявок" },
  {
    title: "До 24 октября",
    text: "Результаты 1 этапа. \nРассылка приглашений для очного выступления.",
  },
  { title: "29–30 октября", text: "Demo Day и подведение итогов" },
];

export const CustomElement = ({ date, children }) => {
  return (
    <div className="flex border-b-2 border-brand-green py-3 gap-3 sm:gap-5 items-start sm:items-center">
      <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        <img src={StarIcon} alt="Иконка звезды" className="w-full h-full" />
      </div>
      <div className="whitespace-pre-line text-sm sm:text-base">
        <b>{date}&nbsp; — &nbsp;</b>
        {children}
      </div>
    </div>
  );
};

export const CustomLi = ({ title, children }) => {
  return (
    <div className="flex gap-3 sm:gap-4 items-start">
      <div className="flex self-start rounded-full bg-brand-green p-2 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
        <img src={RightArrow} alt="стрелка вправо" className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="text-lg sm:text-xl md:text-2xl text-brand-purple font-bold uppercase break-words">
          {title}
        </div>
        <div className="text-sm sm:text-base break-words">{children}</div>
      </div>
    </div>
  );
};

export default function Timeline() {
  return (
    <section className="bg-gray-50 py-12 w-full">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 md:gap-6 mb-14">
          <div className="flex flex-row items-center justify-around lg:flex-col lg:items-start gap-3">
            <Pill className="text-2xl sm:text-3xl md:!text-3xl sm:w-[40%] lg:w-[60%] !py-0 sm:!py-4 md:!py-0">
              ЗАЧЕМ
            </Pill>
            <div className="text-xl sm:text-3xl md:text-3xl">УЧАСТВОВАТЬ?</div>
          </div>
          <div className="max-w-xl text-xs sm:text-sm">
            <div className="space-y-4 sm:space-y-5">
              <CustomLi title="ПОЛУЧИ">
                экспертную поддержку и менторство
              </CustomLi>
              <CustomLi title="РАБОТАЙ">
                с современным оборудованием университета
              </CustomLi>
              <CustomLi title="ПРИСОЕДИНЯЙСЯ">
                к команде единомышленников
              </CustomLi>
              <CustomLi title="ПРОЙДИ">
                путь от идеи до стартапа и попади в национальные акселераторы
              </CustomLi>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 md:gap-6">
          <div className="flex flex-col gap-3 w-full lg:w-auto order-2 lg:order-1">
            {dates.map((item, idx) => (
              <CustomElement date={item.title} key={idx}>
                {item.text}
              </CustomElement>
            ))}
          </div>
          <div className="flex flex-col gap-3 order-1 lg:order-2">
            <div className="flex flex-row items-start justify-around lg:flex-col gap-3">
              <Pill className="flex-start text-2xl sm:text-3xl md:!text-3xl w-full sm:w-[30%] lg:w-[60%] lg:items-start !py-0 sm:!py-4 md:!py-0">
                ДАТЫ
              </Pill>
              <div className="text-xl sm:text-3xl md:text-3xl">
                КЛЮЧЕВЫХ ЭТАПОВ
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
