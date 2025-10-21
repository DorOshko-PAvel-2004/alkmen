import { FC } from "react";
import { Pill } from "@/components/ui/pill.tsx";
import StarIcon from "@/assets/star.svg?url";

interface FormTitleProps {
  title: string;
  withIcon?: boolean;
}

export const FormTitle: FC<FormTitleProps> = ({ title, withIcon = false }) => {
  return (
    <div className="flex gap-1 items-start">
      <Pill className="uppercase">{title}</Pill>
      {withIcon ? <img src={StarIcon} className="w-4" alt="Звёздочка" /> : ""}
    </div>
  );
};
