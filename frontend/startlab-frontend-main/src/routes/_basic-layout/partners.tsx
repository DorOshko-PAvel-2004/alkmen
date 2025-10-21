import { createFileRoute } from "@tanstack/react-router";
import { PartnersPage } from "@/pages/PartnersPage.tsx";

export const Route = createFileRoute("/_basic-layout/partners")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PartnersPage />;
}
