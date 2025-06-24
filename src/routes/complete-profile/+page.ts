import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  // This page should only be accessible to authenticated users
  // The redirect logic is handled in the component itself via reactive statements
  return {};
};
