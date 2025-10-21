import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

export const IdeaComponent = ({
  submitted = false,
  titleValue,
  onTitleChange,
  relevanceValue,
  onRelevanceChange,
  descriptionValue,
  onDescriptionChange,
}: {
  submitted?: boolean;
  titleValue: string;
  onTitleChange: (v: string) => void;
  relevanceValue: string;
  onRelevanceChange: (v: string) => void;
  descriptionValue: string;
  onDescriptionChange: (v: string) => void;
}) => {
  const sTitle = getFieldState(submitted, titleValue);
  const sRel = getFieldState(submitted, relevanceValue);
  const sDescr = getFieldState(submitted, descriptionValue);

  return (
    <FormItem title="научная идея" withIcon={true}>
      <div className="flex flex-col gap-8">
        <FormInput
          title="Наименование научной или инновационной идеи"
          value={titleValue}
          onChange={onTitleChange}
          state={sTitle}
          // @ts-ignore
          data-error={sTitle === "error"}
        />
        <FormInput
          title="Актуальность научной или инновационной идеи"
          placeholder="Опишите, почему ваша идея важна... (не более 1000 символов)"
          maxLength={1000}
          type="textarea"
          value={relevanceValue}
          onChange={onRelevanceChange}
          state={sRel}
          // @ts-ignore
          data-error={sRel === "error"}
        />
        <FormInput
          maxLength={3000}
          type="textarea"
          title="Краткое описание научной или инновационной идеи (не более 3000 символов)"
          placeholder="Дайте развернутое описание ..."
          value={descriptionValue}
          onChange={onDescriptionChange}
          state={sDescr}
          // @ts-ignore
          data-error={sDescr === "error"}
        />
      </div>
    </FormItem>
  );
};
