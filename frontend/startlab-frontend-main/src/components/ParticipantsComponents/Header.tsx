import { Pill } from "@/components/ui/pill";
import TitleLogo from "@/assets/title_logo.svg?url";

export const Header = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Текстовая колонка */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          {/* CTA — как на главной («ПОДАТЬ ЗАЯВКУ») */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl">
              <div className="text-brand-black font-bold">ВСЕМ</div>
              <a id="apply" href="#form">
                <Pill className="!text-2xl sm:!text-3xl md:!text-4xl !px-4 sm:!px-5 md:!px-6 !py-1 sm:!py-1.5 md:!py-1.5">
                  УЧАСТНИКАМ
                </Pill>
              </a>
            </div>
          </div>

          <div className="border-2 border-brand-purple p-4 rounded-xl w-full sm:w-[85%] md:w-[80%] max-w-[40rem]">
            <b>СТАРТЛАБ</b> — университетская платформа для всех, кто хочет
            воплотить свою научную идею или стартап в жизнь.
          </div>
        </div>

        {/* Логотип — те же размеры, что на главной */}
        <img
          src={TitleLogo}
          alt="СТАРТЛАБ — титульный логотип"
          className="w-full max-w-[20rem] sm:max-w-[28rem] lg:w-[36rem] lg:max-w-none"
        />
      </div>
      <div className="bg-gray-100 p-4 rounded-xl">
        Ваша точка входа — ежегодный конкурсный отбор научных и инновационных
        проектов среди студентов и молодых исследователей.
      </div>
    </div>
  );
};
