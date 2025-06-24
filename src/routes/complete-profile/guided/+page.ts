import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
  // Mark as protected route
  return {
    isProtectedRoute: true,
    isGuidedSetup: true,
    edit: url.searchParams.get("edit") === "true",
  };
};
