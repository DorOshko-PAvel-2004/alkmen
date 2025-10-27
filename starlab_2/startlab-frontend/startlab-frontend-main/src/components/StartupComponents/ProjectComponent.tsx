import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const ProjectComponent = ({
  submitted = false,
  titleValue,
  onTitleChange,
  problemShortValue,
  onProblemShortChange,
  goalValue,
  onGoalChange,
}: {
  submitted?: boolean;
  titleValue: string;
  onTitleChange: (v: string) => void;
  problemShortValue: string;
  onProblemShortChange: (v: string) => void;
  goalValue: string;
  onGoalChange: (v: string) => void;
}) => {
  return (
    <FormItem title="Проект" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Название проекта"
          placeholder="Twitch"
          value={titleValue}
          onChange={onTitleChange}
          state={getFieldState(submitted, titleValue)}
          // для скролла к первому error
          // @ts-ignore
          data-error={getFieldState(submitted, titleValue) === "error"}
        />
        <FormInput
          maxLength={50}
          title="Опишите какую проблему решает ваш стартап (50 знаков или меньше)"
          placeholder="Нет удобной платформы для живого гейминг-контента"
          value={problemShortValue}
          onChange={onProblemShortChange}
          state={getFieldState(submitted, problemShortValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, problemShortValue) === "error"}
        />
        <FormInput
          type="textarea"
          title="Цель вашего проекта?"
          placeholder="Мы создаём платформу для прямых трансляций игр с живым чатом и возможностью монетизации. Наша цель — превратить просмотр игр в новое массовое развлечение."
          value={goalValue}
          onChange={onGoalChange}
          state={getFieldState(submitted, goalValue)}
          // @ts-ignore
          data-error={getFieldState(submitted, goalValue) === "error"}
        />
      </div>
    </FormItem>
  );
};
