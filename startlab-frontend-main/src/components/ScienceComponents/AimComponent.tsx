import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const AimComponent = ({
  submitted = false,
  goalValue,
  onGoalChange,
  tasksValue,
  onTasksChange,
}: {
  submitted?: boolean;
  goalValue: string;
  onGoalChange: (v: string) => void;
  tasksValue: string;
  onTasksChange: (v: string) => void;
}) => {
  const sGoal = getFieldState(submitted, goalValue);
  const sTasks = getFieldState(submitted, tasksValue);

  return (
    <FormItem title="Цели и задачи" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Цель научной или инновационной идеи"
          placeholder="Кратко сформулируйте цель"
          type="textarea"
          value={goalValue}
          onChange={onGoalChange}
          state={sGoal}
          // @ts-ignore
          data-error={sGoal === "error"}
        />
        <FormInput
          title="Задачи научной или инновационной идеи"
          placeholder="Перечислите конкретные задачи"
          type="textarea"
          value={tasksValue}
          onChange={onTasksChange}
          state={sTasks}
          // @ts-ignore
          data-error={sTasks === "error"}
        />
      </div>
    </FormItem>
  );
};
