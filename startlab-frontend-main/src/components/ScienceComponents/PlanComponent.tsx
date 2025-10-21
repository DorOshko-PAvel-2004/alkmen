import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const PlanComponent = ({
  submitted = false,
  budgetValue,
  onBudgetChange,
  timelineValue,
  onTimelineChange,
}: {
  submitted?: boolean;
  budgetValue: string;
  onBudgetChange: (v: string) => void;
  timelineValue: string;
  onTimelineChange: (v: string) => void;
}) => {
  const sBudget = getFieldState(submitted, budgetValue);
  const sTimeline = getFieldState(submitted, timelineValue);

  return (
    <FormItem title="План и бюджет" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Предполагаемый бюджет (бел. руб.)"
          value={budgetValue}
          onChange={onBudgetChange}
          state={sBudget}
          // @ts-ignore
          data-error={sBudget === "error"}
        />
        <FormInput
          title="План работ и сроки (MVP, этапы)"
          type="textarea"
          value={timelineValue}
          onChange={onTimelineChange}
          state={sTimeline}
          // @ts-ignore
          data-error={sTimeline === "error"}
        />
      </div>
    </FormItem>
  );
};
