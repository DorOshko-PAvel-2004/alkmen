import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

const RootLayout = () => <Outlet />;

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({ to: "/home" });
    }
  },
});
