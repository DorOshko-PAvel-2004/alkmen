import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const ProgressComponent = ({
  submitted = false,
  stageValue,
  onStageChange,
  needsInvestmentValue,
  onNeedsInvestmentChange,
}: {
  submitted?: boolean;
  stageValue: string;
  onStageChange: (v: string) => void;
  needsInvestmentValue: string;
  onNeedsInvestmentChange: (v: string) => void;
}) => {
  return (
    <FormItem title="ПРОГРЕСС">
      <div className="flex flex-col gap-8">
        <FormInput
          title="На каком этапе вы находитесь и что вы планируете делать в ближайшее время?"
          type="textarea"
          placeholder="У нас есть рабочий прототип, первые тестовые стримы прошли успешно. Следующий шаг — масштабирование серверов и запуск для широкой аудитории."
          value={stageValue}
          onChange={onStageChange}
          state={getFieldState(submitted, stageValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, stageValue) === "error"}
        />
        <FormInput
          title="Нужны ли инвестиции на данном этапе? Если да, то в каком объёме (ориентировочная сумма) и на что они будут направлены?"
          placeholder="Да, мы ищем $500K–$1M. Эти средства пойдут на инфраструктуру, инженеров по стримингу и маркетинг для привлечения первых пользователей."
          type="input"
          value={needsInvestmentValue}
          onChange={onNeedsInvestmentChange}
          state={getFieldState(submitted, needsInvestmentValue)}
          // @ts-ignore
          data-error={
            getFieldState(submitted, needsInvestmentValue) === "error"
          }
        />
      </div>
    </FormItem>
  );
};
