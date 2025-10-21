import { createFileRoute } from "@tanstack/react-router";
import { NewsPage } from "@/pages/NewsPage.tsx";

export const Route = createFileRoute("/_basic-layout/news/")({
  component: News,
});

function News() {
  return <NewsPage />;
}
