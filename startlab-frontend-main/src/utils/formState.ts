export type UIState = "inactive" | "focused" | "filled" | "error" | "disabled";

/** Возвращает UI state для FormInput по простому правилу:\n * - submitted=true: пусто => error, иначе filled\n * - submitted=false: пусто => inactive, иначе filled\n */
export const getFieldState = (submitted: boolean, value?: string): UIState => {
  const v = (value ?? "").trim();
  if (submitted) return v ? "filled" : "error";
  return v ? "filled" : "inactive";
};
