import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const ResultComponent = ({
  submitted = false,
  expectedResultsValue,
  onExpectedResultsChange,
}: {
  submitted?: boolean;
  expectedResultsValue: string;
  onExpectedResultsChange: (v: string) => void;
}) => {
  const s = getFieldState(submitted, expectedResultsValue);
  return (
    <FormItem title="Ожидаемые результаты" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Ожидаемые результаты научной или инновационной идеи"
          placeholder="Укажите, какие результаты вы планируете получить"
          type="textarea"
          value={expectedResultsValue}
          onChange={onExpectedResultsChange}
          state={s}
          // @ts-ignore
          data-error={s === "error"}
        />
      </div>
    </FormItem>
  );
};
