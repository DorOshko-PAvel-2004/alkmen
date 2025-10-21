import { Outlet, useRouterState } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const AppLayout = () => {
  const layoutBg = useRouterState({
    select: (s) => {
      const withBg = [...s.matches]
        .reverse()
        .find((m) => m.staticData?.layoutBg);
      return withBg?.staticData?.layoutBg as string | undefined;
    },
  });
  return (
    <>
      <Header />
      {layoutBg ? (
        <div className={layoutBg}>
          <main className="container-limited">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="container-limited">
          <Outlet />
        </main>
      )}

      <Footer />
    </>
  );
};
