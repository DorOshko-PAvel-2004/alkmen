import React, { FC, useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface FormInputProps {
  type?: "input" | "input+icon" | "dropdown" | "textarea";
  state?: "inactive" | "focused" | "filled" | "error" | "disabled";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  maxLength?: number;
  icon?: string; // URL для <img>, если нужен кастомный значок
  title?: string;
}

export const FormInput: FC<FormInputProps> = ({
  type = "input",
  state = "inactive",
  placeholder = "Текст",
  value = "",
  onChange,
  errorMessage = "Обязательно к заполнению",
  maxLength,
  icon,
  title,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [scrollbarW, setScrollbarW] = useState(0);

  useEffect(() => {
    // измеряем ширину нативного вертикального скроллбара
    const el = document.createElement("div");
    el.style.cssText =
      "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;";
    document.body.appendChild(el);
    const w = el.offsetWidth - el.clientWidth;
    document.body.removeChild(el);
    // fallback для overlay-скроллов (macOS может вернуть 0)
    setScrollbarW(w || 16);
  }, []);

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  };

  const handleFocus = () => {
    if (state !== "disabled") setIsFocused(true);
  };

  const handleBlur = () => setIsFocused(false);

  // Классы по состояниям (цвета бордера/фона/текста)
  const getStateClasses = () => {
    if (state === "disabled") {
      return "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed";
    }
    if (state === "error") {
      return "bg-red-50 border-red-500 text-gray-900";
    }
    if (state === "filled") {
      return "bg-brand-lite-green border-brand-lime text-gray-900";
    }
    if (state === "focused" || isFocused) {
      return "bg-white border-brand-lime text-gray-900 shadow-sm";
    }
    // дефолт
    return "bg-white border border-brand-black text-gray-900";
  };

  const baseInputClasses = `
    w-full h-10 border rounded-md px-3 text-sm outline-none transition-all duration-200
    ${getStateClasses()}
  `;

  const iconInputClasses = `
    ${baseInputClasses} pr-10
  `;

  const dropdownClasses = `
    ${baseInputClasses} flex items-center justify-between pr-3
    ${state === "disabled" ? "cursor-not-allowed" : "cursor-pointer"}
  `;

  const textareaClasses = `
    w-full min-h-20 border rounded-md p-3 text-sm outline-none transition-all duration-0
    resize-y overflow-auto bg-clip-padding
    [scrollbar-width:thin]     /* firefox */
    ${getStateClasses()}
  `;

  const counter = useMemo(() => internalValue.length, [internalValue]);

  if (type === "input") {
    return (
      <div className="w-full flex flex-col gap-2">
        {title ? (
          <div className="uppercase font-bold text-xl text-brand-purple">
            {title}
          </div>
        ) : null}

        <input
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={state === "disabled"}
          className={baseInputClasses}
          maxLength={maxLength}
        />

        {state === "error" && (
          <div className="text-red-500 text-xs mt-1 ml-0.5">{errorMessage}</div>
        )}
      </div>
    );
  }

  if (type === "input+icon") {
    return (
      <div className="w-full flex flex-col gap-2">
        {title ? (
          <div className="uppercase font-bold text-xl text-brand-purple">
            {title}
          </div>
        ) : null}

        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={internalValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={state === "disabled"}
            className={iconInputClasses}
            maxLength={maxLength}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className={
                state === "disabled" ? "text-gray-400" : "text-gray-500"
              }
            >
              {icon ? (
                <img src={icon} alt="Иконка" className="h-4 w-4" />
              ) : (
                <Calendar size={16} />
              )}
            </div>
          </div>
        </div>

        {state === "error" && (
          <div className="text-red-500 text-xs mt-1 ml-0.5">{errorMessage}</div>
        )}
      </div>
    );
  }

  if (type === "dropdown") {
    return (
      <div className="w-full flex flex-col gap-2">
        {title ? (
          <div className="uppercase font-bold text-xl text-brand-purple">
            {title}
          </div>
        ) : null}

        <div
          className={dropdownClasses}
          onClick={() => {
            if (state !== "disabled") {
              // раскрытие списка — здесь заглушка
              console.log("Dropdown clicked");
            }
          }}
        >
          <span className={internalValue ? "" : "text-gray-400"}>
            {internalValue || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={state === "disabled" ? "text-gray-400" : "text-gray-500"}
          />
        </div>

        {state === "error" && (
          <div className="text-red-500 text-xs mt-1 ml-0.5">{errorMessage}</div>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="w-full flex flex-col gap-2">
        {title ? (
          <div className="uppercase font-bold text-xl text-brand-purple">
            {title}
          </div>
        ) : null}

        <textarea
          placeholder={placeholder}
          value={internalValue}
          onChange={handleTextareaChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={state === "disabled"}
          className={textareaClasses}
          // p-3 = 0.75rem; добавляем «желоб» под фактическую ширину скроллбара
          style={{ paddingRight: `calc(0.75rem + ${scrollbarW}px)` }}
          maxLength={maxLength}
        />

        <div
          className={`text-xs mt-1 text-right ${
            state === "error" ? "text-red-500" : "text-gray-500"
          }`}
        >
          {state === "error" ? "Ошибка" : counter}/{maxLength || 100}
        </div>

        {state === "error" && (
          <div className="text-red-500 text-xs mt-1 ml-0.5">{errorMessage}</div>
        )}
      </div>
    );
  }

  return null;
};
