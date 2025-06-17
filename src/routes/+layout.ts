import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, depends }) => {
  depends("auth:user");
  // List of protected routes
  const protectedRoutes = ["/dashboard", "/users", "/settings"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => url.pathname.startsWith(route));

  // In a real app, you'd check auth state here
  // For now, we'll handle this in the client

  return {
    url: url.pathname,
    isProtectedRoute,
  };
};
