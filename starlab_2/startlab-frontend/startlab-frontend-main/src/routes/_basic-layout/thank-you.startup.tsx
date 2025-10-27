import { createFileRoute } from "@tanstack/react-router";
import { ThankYouPage } from "@/pages/ThankYouPage";

export const Route = createFileRoute("/_basic-layout/thank-you/startup")({
  component: () => <ThankYouPage type="startup" />,
  validateSearch: (s: Record<string, unknown>) => ({
    n: typeof s.n === "string" ? s.n : undefined,
  }),
  staticData: {
    layoutBg: "bg-brand-lime",
  },
});
