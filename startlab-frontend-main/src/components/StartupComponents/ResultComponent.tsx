import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const ResultComponent = ({
  submitted = false,
  timelineValue,
  onTimelineChange,
  monetizationValue,
  onMonetizationChange,
}: {
  submitted?: boolean;
  timelineValue: string;
  onTimelineChange: (v: string) => void;
  monetizationValue: string;
  onMonetizationChange: (v: string) => void;
}) => {
  return (
    <FormItem title="результат" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Каковы сроки реализации проекта? Каковы сроки разработки первого MVP?"
          placeholder="MVP уже готов. Полноценный запуск с монетизацией и подписками планируем за 6–9 месяцев."
          type="textarea"
          value={timelineValue}
          onChange={onTimelineChange}
          state={getFieldState(submitted, timelineValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, timelineValue) === "error"}
        />
        <FormInput
          title="Как вы зарабатываете/ собираетесь зарабатывать? Вы потенциально можете заработать?"
          placeholder="Мы монетизируемся через подписки, рекламу и процент с донатов. Рынок игр огромен, и мы можем стать его основной стриминг-платформой."
          type="textarea"
          value={monetizationValue}
          onChange={onMonetizationChange}
          state={getFieldState(submitted, monetizationValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, monetizationValue) === "error"}
        />
      </div>
    </FormItem>
  );
};
