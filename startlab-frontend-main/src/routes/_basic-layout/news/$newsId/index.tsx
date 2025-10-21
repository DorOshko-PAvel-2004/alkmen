import { createFileRoute } from "@tanstack/react-router";
import ArticlePage from "@/pages/ArticlePage.tsx";

export const Route = createFileRoute("/_basic-layout/news/$newsId/")({
  component: Arcticle,
});

function Arcticle() {
  return <ArticlePage />;
}
