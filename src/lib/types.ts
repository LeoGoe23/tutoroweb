import type { User as FirebaseUser } from "firebase/auth";

// Firebase auth types
export type AuthUser = FirebaseUser;

export interface AuthError {
  code: string;
  message: string;
}

// Subscription types
export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  stripePriceId?: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
