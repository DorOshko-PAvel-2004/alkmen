import TGLogo from "@/assets/social/tg.svg?url";
import StacklevelLogo from "@/assets/stacklevel_logo.svg?url";
import DesignerLogo from "@/assets/designer_logo.svg?url";
import BSUIRLogo from "@/assets/bsuir-logo.svg?url";
import ScienceLogo from "@/assets/bsuir-science-logo.svg?url";

export default function Footer() {
  return (
    <footer className="bg-brand-gray2">
      <div className="container-limited py-10">
        {/* Основной контент футера */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-around gap-8 lg:gap-4">
          {/* Навигация */}
          <nav className="text-sm order-2 lg:order-1">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 sm:flex-col sm:space-y-4 sm:gap-x-0">
              <li>
                <a href="/home" className="hover:text-brand-purple">
                  Главная
                </a>
              </li>
              <li>
                <a href="/participants" className="hover:text-brand-purple">
                  Участникам
                </a>
              </li>
              <li>
                <a href="/partners" className="hover:text-brand-purple">
                  Партнёры
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-brand-purple">
                  Новости
                </a>
              </li>
            </ul>
          </nav>

          {/* Социальные сети и контакты */}
          <div className="flex flex-col gap-4 order-1 lg:order-2">
            {/* Контактная информация */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
              <div className="text-center sm:text-left">
                <div>тел: 293 89 07</div>
                <div className="">email: smuofficial@bsuir.by</div>
              </div>
              <div className="flex flex-col justify-center items-center lg:flex-row gap-6">
                <div className="text-center sm:text-right">
                  Республика Беларусь, Минск
                  <br />
                  220013, ул. П. Бровки, 6
                </div>
                <a
                  href="https://t.me/strartlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:ml-4"
                >
                  <img
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-10 lg:w-10"
                    src={TGLogo}
                    alt="логотип tg"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Логотип */}
          <div className="w-48 sm:w-56 lg:w-64 mx-auto lg:mx-0 order-3 flex gap-4 items-center justify-center">
            <a href="https://www.bsuir.by/" target={"_blank"}>
              <img
                src={BSUIRLogo}
                alt="логотип БГУИР"
                className="w-full h-auto"
              />
            </a>
            <a href="https://science.bsuir.by/" target={"_blank"}>
              <img
                src={ScienceLogo}
                alt="логотип НИЧ"
                className="w-full h-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера — адаптив */}
      <div className="!bg-brand-milk">
        <div className="container-limited px-4">
          <div className="flex flex-col md:flex-col items-center md:items-center justify-center md:justify-between gap-2 md:gap-2 py-2 md:py-3 flex-wrap">
            <div className="flex items-center gap-4 md:gap-6 shrink-0 flex-wrap justify-center">
              <a href="https://taplink.cc/yana.radzevich" target="_blank">
                <img
                  src={DesignerLogo}
                  alt="Лого дизайнера"
                  className="h-6 md:h-8 w-16 md:w-24"
                />
              </a>
              <a href="https://stacklevel.group/" target="_blank">
                <img
                  src={StacklevelLogo}
                  alt="Лого стеклевел"
                  className="h-6 md:h-8 w-40 md:w-52"
                />
              </a>
            </div>
            <div className="text-xs text-gray-500 text-center md:text-right w-full md:w-auto">
              © {new Date().getFullYear()} Стартлаб БГУИР
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
