import * as React from "react";
import { FC } from "react";
import { FormTitle } from "@/components/ui/form-title.tsx";

interface FormItemProps {
  title: string;
  withIcon?: boolean;
  children: React.ReactNode;
}

export const FormItem: FC<FormItemProps> = ({
  title,
  withIcon = false,
  children,
}) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <FormTitle title={title} withIcon={withIcon} />
      {children}
    </div>
  );
};
