import type { SubscriptionPlan, SubscriptionTier, UserSubscription } from './types';
import { userProfileService } from './userProfile';

// Define subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      '5 Tutoring Sessions pro Monat',
      'Basis Support',
      'Standard Lernmaterialien',
      'Community Access'
    ]
  },  {
    id: 'plus',
    name: 'Plus',
    price: 19,
    currency: 'EUR',
    interval: 'month',
    isPopular: true,
    features: [
      'Unlimited Tutoring Sessions',
      '24/7 Premium Support',
      'Alle Lernmaterialien',
      'Personalisierte Lernpläne',
      'Video Aufzeichnungen',
      'Live Gruppensessions',
      'Mobile App Access',
      'Fortschritts-Tracking'
    ],
    stripePriceId: 'price_plus_monthly' // Placeholder - replace with actual Stripe price ID
  },  {
    id: 'pro',
    name: 'Pro',
    price: 0, // Price not announced yet
    currency: 'EUR',
    interval: 'month',
    comingSoon: true,
    features: [
      'Alles aus Plus',
      'Dedicated Account Manager',
      'Custom Lernpläne',
      'White-label Optionen',
      'API Access',
      'Enterprise Support',
      'Advanced Analytics',
      'Priority Scheduling'
    ],
    stripePriceId: 'price_pro_monthly' // Placeholder - replace with actual Stripe price ID
  }
];

export const subscriptionService = {
  // Get all available plans
  getPlans: (): SubscriptionPlan[] => subscriptionPlans,

  // Get a specific plan by ID
  getPlan: (planId: SubscriptionTier): SubscriptionPlan | undefined => {
    return subscriptionPlans.find(plan => plan.id === planId);
  },

  // Check if user can access a feature based on their subscription
  canAccessFeature: (userSubscription: UserSubscription | undefined, feature: string): boolean => {
    if (!userSubscription) return false;
    
    const currentPlan = subscriptionPlans.find(plan => plan.id === userSubscription.tier);
    return currentPlan?.features.includes(feature) || false;
  },
  // Get feature limits based on subscription tier
  getFeatureLimits: (tier: SubscriptionTier) => {
    const limits = {
      free: {
        sessionsPerMonth: 5,
        storageGB: 1,
        supportLevel: 'basic'
      },
      plus: {
        sessionsPerMonth: -1, // unlimited
        storageGB: 50,
        supportLevel: 'premium'
      },
      pro: {
        sessionsPerMonth: -1, // unlimited
        storageGB: 500,
        supportLevel: 'enterprise'
      }
    };
    
    return limits[tier] || limits.free;
  },
  // Create Stripe checkout session (placeholder)
  createCheckoutSession: async (planId: SubscriptionTier, userId: string): Promise<{ url: string }> => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan?.stripePriceId) {
      throw new Error('Invalid plan or missing Stripe price ID');
    }

    // TODO: Replace with actual Stripe API call
    // This is a placeholder that will be replaced with actual Stripe integration
    console.log('Creating checkout session for:', { planId, userId, stripePriceId: plan.stripePriceId });
    
    // For now, redirect to a placeholder Stripe checkout URL
    // Replace this with actual Stripe checkout session creation
    return {
      url: `https://checkout.stripe.com/c/pay/cs_test_${planId}_${userId}#fidkdWxOYHwnPyd1blpxYHZxWjA0VGtrbXZzYUtfVWBHS0lGUElfNTVJZlVhQXx8c2hXbXNRSW9WNzNyXzRpYkZVS0ljMW9hNnRVRnJVREFUclZqVUJST2FwT2E2UnBHQTBEV2tHVXNGU3E9PXJ8YDNtPScpJ3VpbGtuQH11anZgYUxhJz8ncWB2cVo5PWApJ2lkfGpwcVF8dWAnPSdocGlxbHpscWNgZSc%2FJ3Zsa2JwK39sc2dubCc%2FcWhsK3Vsd2JuPSdpbmpmZWByPWNfKXZqbCd3YGZgKT9kcGZgc2NfKXVmKXRubnFgY3JhY2xpYmI%2BKW1wJz8nZWdsJ3ZpZHZhKGFxbGQncCd0Y2pgdycnJCcpc3VpZnRxZ2BuZnNxJ3ApJ2hwbGEneCUl`
    };
  },

  // Create customer portal session (placeholder)
  createPortalSession: async (customerId: string): Promise<{ url: string }> => {
    // TODO: Replace with actual Stripe API call
    console.log('Creating portal session for customer:', customerId);
    
    // Placeholder response
    return {
      url: `https://billing.stripe.com/placeholder?customer=${customerId}`
    };
  },

  // Update user subscription after successful payment
  updateUserSubscription: async (userId: string, subscriptionData: Partial<UserSubscription>) => {
    return await userProfileService.updateUserSubscription(userId, subscriptionData);
  },

  // Cancel subscription
  cancelSubscription: async (userId: string, subscriptionId: string) => {
    // TODO: Cancel subscription in Stripe
    console.log('Canceling subscription:', { userId, subscriptionId });
    
    // Update user profile to mark subscription as canceled
    return await userProfileService.updateUserSubscription(userId, {
      status: 'canceled',
      cancelAtPeriodEnd: true
    });
  }
};
