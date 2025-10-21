import { createFileRoute } from "@tanstack/react-router";
import { ThankYouPage } from "@/pages/ThankYouPage";

export const Route = createFileRoute("/_basic-layout/thank-you/science")({
  component: () => <ThankYouPage type="science" />,
  validateSearch: (s: Record<string, unknown>) => ({
    n: typeof s.n === "string" ? s.n : undefined,
  }),
  staticData: {
    layoutBg: "bg-brand-purple",
  },
});
