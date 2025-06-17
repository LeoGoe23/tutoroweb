import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
  // Get parent layout data
  const data = await parent();

  // This will be handled on the client-side since Firebase auth is client-side
  return {};
};
