import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { subscriptionService } from "$lib/subscription";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { planId, userId } = await request.json();
    if (!planId || !userId) {
      return json({ error: "PlanId oder UserId fehlt" }, { status: 400 });
    }

    // Create checkout session
    const session = await subscriptionService.createCheckoutSession(planId, userId);

    return json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return json({ error: "Fehler beim Erstellen der Checkout-Session" }, { status: 500 });
  }
};
