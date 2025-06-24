#!/usr/bin/env node

// Simple demonstration script for subscription functionality
import { subscriptionService } from './src/lib/subscription.js';

console.log('🎯 Tutoro Subscription Management Demo\n');

// Display all available plans
console.log('📋 Available Subscription Plans:');
const plans = subscriptionService.getPlans();
plans.forEach(plan => {
  console.log(`\n💎 ${plan.name} Plan`);
  console.log(`   Price: €${plan.price}/${plan.interval}`);
  console.log(`   Features: ${plan.features.length} features`);
  if (plan.isPopular) console.log('   ⭐ Most Popular');
});

// Display feature limits
console.log('\n\n⚡ Feature Limits by Tier:');
const tiers = ['free', 'plus', 'pro'];
tiers.forEach(tier => {
  const limits = subscriptionService.getFeatureLimits(tier);
  console.log(`\n${tier.toUpperCase()}:`);
  console.log(`   Sessions: ${limits.sessionsPerMonth === -1 ? 'Unlimited' : limits.sessionsPerMonth}/month`);
  console.log(`   Storage: ${limits.storageGB} GB`);
  console.log(`   Support: ${limits.supportLevel}`);
});

console.log('\n✅ Subscription system is ready!');
console.log('🌐 Visit http://localhost:5174/subscription to see the UI');
console.log('\n📚 Next steps:');
console.log('   1. Add your Stripe API keys to .env.local');
console.log('   2. Update Stripe price IDs in subscription.ts');
console.log('   3. Test the complete payment flow');
console.log('   4. Configure webhook endpoints');
