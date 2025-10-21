import React, {useCallback, useRef, useState} from "react";

/**
 * Дропзона «Перетяните файл сюда» — визуально 1-в-1 как на картинке:
 *  - светло-голубой фон
 *  - пунктирная фиолетовая рамка с радиусом
 *  - толстая стрелка вниз
 *  - подпись «Перетяните файл сюда», где «сюда» полужирным
 * Поведение: drag & drop видеофайла(ов) или клик для выбора.
 */
export const Dropzone: React.FC<{
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}> = ({ onFiles, accept = "video/*", multiple = true, className = "" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList);
      onFiles?.(files);
    },
    [onFiles],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      aria-label="Перетяните файл сюда или нажмите для выбора"
      className={[
        "relative select-none w-full max-w-[430px] h-[202px]",
        "rounded-xl border-2 border-dashed",
        "bg-[#F6FBFF]", // очень светло-голубой
        isDragOver ? "border-violet-500" : "border-violet-300",
        "transition-colors duration-150 ease-in-out",
        "cursor-pointer",
        className,
      ].join(" ")}
    >
      {/* Внутреннее содержимое по центру */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          {/* Толстая стрелка вниз */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-2"
          >
            <path
              d="M12 3v14m0 0-5-5m5 5 5-5"
              stroke="#3B28FF"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-[16px] leading-5 text-gray-600">
            Перетяните файл{" "}
            <span className="font-semibold text-gray-700">сюда</span>
          </p>
        </div>
      </div>

      {/* Невидимый input для клика */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};
