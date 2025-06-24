import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscriptionService } from '$lib/subscription';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { planId, userId } = await request.json();

    if (!planId || !userId) {
      return json({ error: 'Missing planId or userId' }, { status: 400 });
    }

    // Create checkout session
    const session = await subscriptionService.createCheckoutSession(planId, userId);

    return json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
};
