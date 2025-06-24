<script lang="ts">
  import { onMount } from 'svelte';
  import { user, userProfile, loading as authLoading } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { subscriptionService } from '$lib/subscription';
  import type { SubscriptionPlan, SubscriptionTier } from '$lib/types';

  let plans: SubscriptionPlan[] = [];
  let loading = false;
  let error = '';  // Redirect if not authenticated (only on client side)
  $: if (browser && !$authLoading && $user === null) {
    goto('/auth');
  }

  onMount(() => {
    plans = subscriptionService.getPlans();
  });
  async function handleUpgrade(planId: SubscriptionTier) {
    if (!$user) return;
    
    const plan = subscriptionService.getPlan(planId);
    if (plan?.comingSoon) {
      alert('Dieser Plan ist noch nicht verfügbar. Wir arbeiten daran!');
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      if (planId === 'free') {
        // Downgrade to free
        await subscriptionService.updateUserSubscription($user.uid, {
          tier: 'free',
          status: 'active'
        });
        // Refresh user profile
        location.reload();
      } else {
        // Redirect to Stripe checkout (placeholder)
        const { url } = await subscriptionService.createCheckoutSession(planId, $user.uid);
        window.location.href = url;
      }
    } catch (err) {
      error = 'Fehler beim Ändern des Abonnements. Bitte versuchen Sie es erneut.';
      console.error('Subscription error:', err);
    } finally {
      loading = false;
    }
  }

  async function handleManageBilling() {
    if (!$user || !$userProfile?.subscription?.stripeCustomerId) return;
    
    loading = true;
    try {
      const { url } = await subscriptionService.createPortalSession($userProfile.subscription.stripeCustomerId);
      window.location.href = url;
    } catch (err) {
      error = 'Fehler beim Öffnen des Billing-Portals.';
      console.error('Portal error:', err);
    } finally {
      loading = false;
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  function isCurrentPlan(planId: SubscriptionTier): boolean {
    return $userProfile?.subscription?.tier === planId;
  }  function getButtonText(planId: SubscriptionTier): string {
    const plan = subscriptionService.getPlan(planId);
    
    if (plan?.comingSoon) {
      return 'Bald verfügbar';
    }
    
    if (isCurrentPlan(planId)) {
      return 'Aktueller Plan';
    }
    
    const currentTier = $userProfile?.subscription?.tier || 'free';
    const tierOrder = ['free', 'plus', 'pro'];
    const currentIndex = tierOrder.indexOf(currentTier);
    const targetIndex = tierOrder.indexOf(planId);
    
    if (targetIndex > currentIndex) {
      return 'Upgrade';
    } else if (targetIndex < currentIndex) {
      return 'Downgrade';
    }
    
    return 'Auswählen';
  }
</script>

<svelte:head>
  <title>Subscription Management - Tutoro</title>
</svelte:head>

<div class="subscription-page">
  <div class="container">
    <div class="header">
      <h1>Abonnement verwalten</h1>
      <p>Wählen Sie das perfekte Paket für Ihre Lernbedürfnisse</p>
    </div>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <!-- Current Subscription Status -->
    {#if $userProfile?.subscription}
      <div class="current-subscription">
        <h2>Ihr aktuelles Abonnement</h2>
        <div class="current-plan-card">
          <div class="plan-info">
            <h3>{subscriptionService.getPlan($userProfile.subscription.tier)?.name || 'Unknown'}</h3>
            <p class="status status-{$userProfile.subscription.status}">
              Status: {$userProfile.subscription.status === 'active' ? 'Aktiv' : 
                      $userProfile.subscription.status === 'canceled' ? 'Gekündigt' : 
                      $userProfile.subscription.status}
            </p>
            {#if $userProfile.subscription.currentPeriodEnd}
              <p class="renewal-date">
                Nächste Abrechnung: {new Date($userProfile.subscription.currentPeriodEnd).toLocaleDateString('de-DE')}
              </p>
            {/if}
          </div>
          {#if $userProfile.subscription.tier !== 'free' && $userProfile.subscription.stripeCustomerId}
            <button 
              on:click={handleManageBilling} 
              disabled={loading}
              class="btn btn-secondary"
            >
              Abrechnung verwalten
            </button>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Subscription Plans -->
    <div class="plans-section">
      <h2>Verfügbare Pläne</h2>
      <div class="plans-grid">        {#each plans as plan (plan.id)}
          <div class="plan-card" class:popular={plan.isPopular} class:current={isCurrentPlan(plan.id)} class:coming-soon={plan.comingSoon}>
            {#if plan.isPopular}
              <div class="popular-badge">Beliebt</div>
            {/if}
            
            {#if plan.comingSoon}
              <div class="coming-soon-badge">Bald verfügbar</div>
            {/if}
              <div class="plan-header">
              <h3>{plan.name}</h3>
              <div class="price">
                {#if plan.comingSoon && plan.price === 0}
                  <span class="amount-coming-soon">Preis folgt</span>
                {:else}
                  <span class="amount">{formatPrice(plan.price)}</span>
                  {#if plan.price > 0}
                    <span class="interval">/{plan.interval === 'month' ? 'Monat' : 'Jahr'}</span>
                  {/if}
                {/if}
              </div>
            </div>

            <ul class="features-list">
              {#each plan.features as feature}
                <li>
                  <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {feature}
                </li>
              {/each}
            </ul>

            <button 
              on:click={() => handleUpgrade(plan.id)}
              disabled={loading || isCurrentPlan(plan.id) || plan.comingSoon}
              class="btn {isCurrentPlan(plan.id) ? 'btn-current' : plan.comingSoon ? 'btn-coming-soon' : plan.isPopular ? 'btn-primary' : 'btn-outline'}"
            >
              {loading ? 'Laden...' : getButtonText(plan.id)}
            </button>
          </div>
        {/each}
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <h2>Häufig gestellte Fragen</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Kann ich jederzeit kündigen?</h4>
          <p>Ja, Sie können Ihr Abonnement jederzeit kündigen. Ihr Zugang bleibt bis zum Ende des aktuellen Abrechnungszeitraums bestehen.</p>
        </div>
        <div class="faq-item">
          <h4>Was passiert bei einem Downgrade?</h4>
          <p>Bei einem Downgrade wird Ihr neuer Plan am Ende des aktuellen Abrechnungszeitraums aktiv. Sie behalten bis dahin Zugang zu allen Premium-Features.</p>
        </div>
        <div class="faq-item">
          <h4>Wie funktioniert die Abrechnung?</h4>
          <p>Die Abrechnung erfolgt automatisch über Stripe. Sie erhalten eine Rechnung per E-Mail und können Ihre Zahlungsmethoden jederzeit verwalten.</p>
        </div>
        <div class="faq-item">
          <h4>Gibt es eine Geld-zurück-Garantie?</h4>
          <p>Ja, wir bieten eine 30-Tage-Geld-zurück-Garantie für alle kostenpflichtigen Pläne. Kontaktieren Sie einfach unseren Support.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .subscription-page {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
  }

  .header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .header p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
  }

  .current-subscription {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 3rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .current-subscription h2 {
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  .current-plan-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
  }

  .plan-info h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  .status {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .status-active {
    color: #10b981;
  }

  .status-canceled {
    color: #ef4444;
  }

  .renewal-date {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .plans-section {
    margin-bottom: 4rem;
  }

  .plans-section h2 {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 3rem;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .plan-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 2px solid transparent;
  }

  .plan-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .plan-card.popular {
    border-color: #6366f1;
    transform: scale(1.05);
  }

  .plan-card.current {
    border-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  }
  .popular-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .plan-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .plan-header h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.5rem;
  }

  .amount {
    font-size: 3rem;
    font-weight: 700;
    color: #6366f1;
  }

  .amount-coming-soon {
    font-size: 1.5rem;
    font-weight: 600;
    color: #6b7280;
    font-style: italic;
  }

  .interval {
    color: #6b7280;
    font-size: 1rem;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }

  .features-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    color: #374151;
  }

  .check-icon {
    width: 20px;
    height: 20px;
    color: #10b981;
    flex-shrink: 0;
  }

  .btn {
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }

  .btn-outline {
    background: transparent;
    color: #6366f1;
    border: 2px solid #6366f1;
  }

  .btn-outline:hover:not(:disabled) {
    background: #6366f1;
    color: white;
  }

  .btn-current {
    background: #10b981;
    color: white;
  }

  .btn-coming-soon {
    background: #9ca3af;
    color: white;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    width: auto;
    padding: 0.75rem 1.5rem;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #4b5563;
  }

  .faq-section {
    background: white;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .faq-section h2 {
    text-align: center;
    color: #1f2937;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  .faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .faq-item h4 {
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .faq-item p {
    color: #6b7280;
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .header h1 {
      font-size: 2rem;
    }

    .header p {
      font-size: 1rem;
    }

    .plans-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .plan-card.popular {
      transform: none;
    }

    .current-plan-card {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .faq-section {
      padding: 2rem;
    }

    .faq-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
