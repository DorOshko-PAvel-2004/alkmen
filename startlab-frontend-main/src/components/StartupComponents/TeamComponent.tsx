import React from "react";
import { FormItem } from "@/components/FormComponents/FormItem.tsx";
import { FormInput } from "@/components/FormComponents/FormInput.tsx";
import { getFieldState } from "@/utils/formState";

type Props = {
  submitted?: boolean; // не влияет на error для Team, но оставим для совместимости
  videoUrlValue: string;
  onVideoUrlChange: (v: string) => void;
  positionsLabelValue: string;
  onPositionsLabelChange: (v: string) => void;
};

export const TeamComponent: React.FC<Props> = ({
  videoUrlValue,
  onVideoUrlChange,
  positionsLabelValue,
  onPositionsLabelChange,
}) => {
  const urlState = getFieldState(false, videoUrlValue);
  const positionsState = getFieldState(false, positionsLabelValue);

  return (
    <FormItem title="ОСНОВАТЕЛИ И КОМАНДА">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <div className="uppercase font-bold text-xl text-brand-purple">
            Снимите 1-минутное видео об основателях проекта
          </div>
          <div className="text-lg text-gray-500">Добавьте ссылку на видео.</div>

          {/* URL */}
          <div className="flex items-center justify-between gap-4">
            <FormInput
              placeholder="https://"
              value={videoUrlValue}
              onChange={onVideoUrlChange}
              state={urlState} // <- как в Progress, но без error
            />
          </div>

          <div className="mb-3" />

          <div className="uppercase font-bold text-xl text-brand-purple">
            Ищите ли вы себе со-основателей и команду?
          </div>
          <div className="text-lg text-gray-500">
            Если да, то укажите на какие позиции и какой уровень навыков
            необходим.
          </div>
          <FormInput
            type="textarea"
            value={positionsLabelValue}
            onChange={onPositionsLabelChange}
            state={positionsState} // <- как в Progress, но без error
          />
        </div>
      </div>
    </FormItem>
  );
};
