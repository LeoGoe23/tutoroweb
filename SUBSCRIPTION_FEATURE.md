# Subscription Management Feature

This document describes the subscription management system implemented in the Tutoro application.

## Overview

The subscription system provides a tiered pricing model with three plans:

- **Free**: Basic access with limited features
- **Plus**: Enhanced features with unlimited sessions (Most Popular)
- **Pro**: Enterprise-level features for power users

## Features Implemented

### 1. Subscription Types and Plans

- Three subscription tiers with different feature sets
- Configurable pricing and feature limits
- German localization for all UI elements

### 2. User Profile Integration
- Automatic free tier assignment for new users
- Subscription status tracking in user profiles
- Usage limits based on subscription tier

### 3. Subscription Management Page (`/subscription`)
- Beautiful, responsive pricing page
- Current subscription status display
- Upgrade/downgrade functionality
- FAQ section for common questions

### 4. Dashboard Integration
- Subscription status component showing current plan
- Usage limits and renewal information
- Quick access to subscription management

### 5. API Endpoints (Stripe Integration Ready)
- `/api/stripe/checkout` - Create checkout sessions
- `/api/stripe/portal` - Customer portal access
- `/api/stripe/webhook` - Handle Stripe webhooks

### 6. Navigation Integration
- Subscription link in main navigation
- Protected route authentication

## Files Created/Modified

### New Files:
- `src/lib/types.ts` - Added subscription types
- `src/lib/subscription.ts` - Subscription service with business logic
- `src/routes/subscription/+page.svelte` - Main subscription management page
- `src/routes/subscription/+page.ts` - Page load function
- `src/lib/components/SubscriptionStatus.svelte` - Reusable status component
- `src/routes/api/stripe/checkout/+server.ts` - Checkout API endpoint
- `src/routes/api/stripe/portal/+server.ts` - Portal API endpoint
- `src/routes/api/stripe/webhook/+server.ts` - Webhook handler

### Modified Files:
- `src/lib/userProfile.ts` - Added subscription fields and methods
- `src/routes/+layout.svelte` - Added subscription navigation
- `src/routes/+layout.ts` - Added subscription to protected routes
- `src/routes/dashboard/+page.svelte` - Added subscription status display

## Subscription Plans

### Free Tier
- 5 tutoring sessions per month
- Basic support
- Standard learning materials
- Community access
- **Price**: €0/month

### Plus Plan (Most Popular) - Coming Soon

- Unlimited tutoring sessions
- 24/7 premium support
- All learning materials
- Personalized learning plans
- Video recordings
- Live group sessions
- Mobile app access
- Progress tracking
- **Price**: €19/month
- **Status**: 🚧 Bald verfügbar

### Pro Plan - Coming Soon

- Everything from Plus
- Dedicated account manager
- Custom learning plans
- White-label options
- API access
- Enterprise support
- Advanced analytics
- Priority scheduling
- **Price**: €79.99/month
- **Status**: 🚧 Bald verfügbar

## Stripe Integration Setup

To complete the Stripe integration, you'll need to:

1. **Install Stripe SDK**:
   ```bash
   npm install stripe
   ```

2. **Add Environment Variables** (add to `.env.local`):
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Update Stripe Price IDs** in `src/lib/subscription.ts`:
   - Replace placeholder price IDs with actual Stripe price IDs
   - Update product configurations

4. **Implement Real Stripe Calls**:
   - Replace placeholder functions in `subscriptionService`
   - Add proper webhook signature verification
   - Implement customer and subscription management

5. **Test Webhooks**:
   - Use Stripe CLI for local testing
   - Configure webhook endpoints in Stripe dashboard

## Security Considerations

- All subscription changes require user authentication
- Webhook signature verification (to be implemented)
- Secure handling of Stripe customer data
- Protected routes for subscription management

## Usage Limits and Features

The system tracks usage limits based on subscription tiers:

- **Sessions per month**: Enforced limit based on plan
- **Storage**: Different storage quotas per tier
- **Support level**: Varies from basic to enterprise

## Future Enhancements

1. **Payment Method Management**: Allow users to update payment methods
2. **Invoice History**: Display past invoices and payments
3. **Usage Analytics**: Show detailed usage statistics
4. **Team/Family Plans**: Multi-user subscription options
5. **Annual Billing**: Discounted yearly subscriptions
6. **Promo Codes**: Coupon and discount system

## Testing

Before going live:
1. Test all subscription flows with Stripe test mode
2. Verify webhook handling for all subscription events
3. Test upgrade/downgrade scenarios
4. Validate usage limit enforcement
5. Check responsive design on all devices

## Support

For subscription-related issues:
- Users can access billing portal through the subscription page
- Customer support can manage subscriptions through Stripe dashboard
- Failed payments trigger automatic retry logic
- Grace period handling for expired subscriptions
