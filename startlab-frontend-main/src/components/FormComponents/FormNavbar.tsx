import RightArrow from "@/assets/right_arrow.svg?url";
import { Pill } from "@/components/ui/pill";

type FormNavbarProps = {
  variant?: "startup" | "science";
  /** отступ от верха окна (под фикс-хедер), напр. "top-24" */
  stickyTopClass?: string;
};

const ITEMS_STARTUP = [
  { id: "project", label: "ПРОЕКТ" },
  { id: "idea", label: "ИДЕЯ" },
  { id: "progress", label: "ПРОГРЕСС" },
  { id: "result", label: "РЕЗУЛЬТАТ" },
  { id: "team", label: "ОСНОВАТЕЛИ И КОМАНДА" },
  { id: "extra", label: "ДОПОЛНИТЕЛЬНО" },
];

const ITEMS_SCIENCE = [
  { id: "s-idea", label: "ИДЕЯ" },
  { id: "s-aim", label: "ЦЕЛИ И ЗАДАЧИ" },
  { id: "s-result", label: "ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ" },
  { id: "s-market", label: "РЫНОК И КОНКУРЕНТЫ" },
  { id: "s-plan", label: "ПЛАН И БЮДЖЕТ" },
  { id: "s-team", label: "КОМАНДА" },
  { id: "s-extra", label: "ДОПОЛНИТЕЛЬНО" },
];

export const FormNavbar: React.FC<FormNavbarProps> = ({
  variant = "startup",
}) => {
  const items = variant === "science" ? ITEMS_SCIENCE : ITEMS_STARTUP;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside>
      <nav className="flex flex-col gap-3 items-start justify-start w-full">
        <div className="flex gap-2 items-center">
          <div className="bg-brand-lime rounded-full p-2 shrink-0">
            <img src={RightArrow} alt="Стрелка вправо" className="w-5 h-5" />
          </div>
          <Pill color="purple">РАЗДЕЛЫ</Pill>
        </div>

        {items.map((item) => (
          <div key={item.id} className="text-lg font-bold text-brand-purple">
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="hover:underline focus:underline outline-none"
            >
              {item.label}
            </a>
          </div>
        ))}
      </nav>
    </aside>
  );
};
