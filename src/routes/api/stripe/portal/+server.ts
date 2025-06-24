import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { subscriptionService } from "$lib/subscription";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { customerId } = await request.json();
    if (!customerId) {
      return json({ error: "CustomerId fehlt" }, { status: 400 });
    }

    // Create portal session
    const session = await subscriptionService.createPortalSession(customerId);

    return json({ url: session.url });
  } catch (error) {
    console.error("Portal session creation failed:", error);
    return json({ error: "Fehler beim Erstellen der Portal-Session" }, { status: 500 });
  }
};
