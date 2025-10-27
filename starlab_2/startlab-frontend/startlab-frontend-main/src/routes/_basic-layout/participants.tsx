import { createFileRoute } from "@tanstack/react-router";
import { ParticipantsPage } from "@/pages/ParticipantsPage.tsx";

export const Route = createFileRoute("/_basic-layout/participants")({
  component: Participants,
});

function Participants() {
  return <ParticipantsPage />;
}
