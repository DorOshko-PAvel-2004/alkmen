import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";

export const AddComponent = ({
  additionalInfoValue,
  onAdditionalInfoChange,
}: {
  additionalInfoValue: string;
  onAdditionalInfoChange: (v: string) => void;
}) => {
  return (
    <FormItem title="ДОПОЛНИТЕЛЬНО">
      <div className="flex flex-col gap-1">
        <div className="uppercase font-bold text-xl text-brand-purple">
          Укажите дополнительную информацию
        </div>
        <div className="text-lg text-gray-500">При необходимости.</div>
        <FormInput
          placeholder="(при наличии презентации, видео, статьи в СМИ, ссылки на сообщение о научной или инновационной идее, страницы в социальных сетях, адрес сайта и пр.)"
          type="textarea"
          value={additionalInfoValue}
          onChange={onAdditionalInfoChange}
        />
      </div>
    </FormItem>
  );
};
