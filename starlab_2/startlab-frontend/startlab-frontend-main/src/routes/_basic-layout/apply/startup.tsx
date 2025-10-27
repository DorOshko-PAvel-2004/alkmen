import { createFileRoute } from "@tanstack/react-router";
import { StartupFormPage } from "@/pages/StartupFormPage.tsx";

export const Route = createFileRoute("/_basic-layout/apply/startup")({
  component: StartupForm,
});

function StartupForm() {
  return <StartupFormPage />;
}
