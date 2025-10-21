import { createFileRoute } from "@tanstack/react-router";
import { ScienceFormPage } from "@/pages/ScienceFormPage.tsx";

export const Route = createFileRoute("/_basic-layout/apply/science")({
  component: ScienceForm,
});

function ScienceForm() {
  return <ScienceFormPage />;
}
