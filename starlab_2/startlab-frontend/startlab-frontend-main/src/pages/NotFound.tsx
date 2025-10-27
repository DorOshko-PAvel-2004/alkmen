export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 className="text-[72px] leading-none m-0 font-extrabold tracking-tight">
          <span className="text-brand-lime">4</span>

          {/* 0: верхняя половина лайм, нижняя половина пурпур */}
          <span className="relative inline-block align-baseline">
            {/* верхняя половина (лайм) */}
            <span
              className="block text-brand-lime"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 0 50%, transparent 50%)",
                maskImage:
                  "linear-gradient(to bottom, #000 0 50%, transparent 50%)",
              }}
            >
              0
            </span>

            {/* нижняя половина (пурпур) */}
            <span
              aria-hidden
              className="absolute inset-0 text-brand-purple"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0 50%, #000 50%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0 50%, #000 50%)",
              }}
            >
              0
            </span>
          </span>

          <span className="text-brand-purple">4</span>
        </h1>
        <p style={{ margin: "16px 0 24px", fontSize: 18, color: "#667085" }}>
          Такой страницы нет или она была перемещена.
        </p>

        <div style={{ display: "inline-flex", gap: 12 }}>
          <a
            href="/"
            className="hover:!bg-gray-300 transition-colors duration-300"
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid #d0d5dd",
              textDecoration: "none",
            }}
          >
            На главную
          </a>

          <a
            href="mailto:smuofficial@bsuir.by"
            className="bg-brand-lime text-brand-purple hover:bg-brand-purple hover:text-brand-lime duration-300"
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              textDecoration: "none",
            }}
          >
            Сообщить о проблеме
          </a>
        </div>
      </div>
    </div>
  );
}
