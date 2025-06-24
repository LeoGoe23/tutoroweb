<script lang="ts">
  import { userProfile } from '$lib/auth';
  import { subscriptionService } from '$lib/subscription';
  import type { SubscriptionTier } from '$lib/types';

  $: currentPlan = $userProfile?.subscription ? subscriptionService.getPlan($userProfile.subscription.tier) : null;
  $: limits = $userProfile?.subscription ? subscriptionService.getFeatureLimits($userProfile.subscription.tier) : null;

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#10b981';
      case 'canceled': return '#ef4444';
      case 'past_due': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'canceled': return 'Gekündigt';
      case 'past_due': return 'Überfällig';
      case 'unpaid': return 'Unbezahlt';
      default: return status;
    }
  }
</script>

{#if $userProfile?.subscription && currentPlan}
  <div class="subscription-status">
    <div class="status-header">
      <div class="plan-info">
        <h3>{currentPlan.name} Plan</h3>
        <span 
          class="status-badge" 
          style="background-color: {getStatusColor($userProfile.subscription.status)};"
        >
          {getStatusText($userProfile.subscription.status)}
        </span>
      </div>
      <a href="/subscription" class="manage-link">Verwalten</a>
    </div>

    {#if limits}
      <div class="usage-info">
        <div class="usage-item">
          <span class="label">Sessions pro Monat:</span>
          <span class="value">
            {limits.sessionsPerMonth === -1 ? 'Unbegrenzt' : limits.sessionsPerMonth}
          </span>
        </div>
        <div class="usage-item">
          <span class="label">Speicher:</span>
          <span class="value">{limits.storageGB} GB</span>
        </div>
        <div class="usage-item">
          <span class="label">Support Level:</span>
          <span class="value">{limits.supportLevel}</span>
        </div>
      </div>
    {/if}

    {#if $userProfile.subscription.currentPeriodEnd}
      <div class="renewal-info">
        <small>
          {$userProfile.subscription.cancelAtPeriodEnd ? 'Läuft ab am' : 'Erneuert am'}: 
          {new Date($userProfile.subscription.currentPeriodEnd).toLocaleDateString('de-DE')}
        </small>
      </div>
    {/if}
  </div>
{:else}
  <div class="subscription-status">
    <div class="no-subscription">
      <p>Kein aktives Abonnement</p>
      <a href="/subscription" class="upgrade-link">Jetzt upgraden</a>
    </div>
  </div>
{/if}

<style>
  .subscription-status {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .plan-info h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .status-badge {
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .manage-link {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .manage-link:hover {
    text-decoration: underline;
  }

  .usage-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .usage-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .usage-item .label {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
  }

  .usage-item .value {
    font-weight: 600;
    color: #1f2937;
  }

  .renewal-info {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }

  .renewal-info small {
    color: #6b7280;
  }

  .no-subscription {
    text-align: center;
    padding: 1rem 0;
  }

  .no-subscription p {
    margin: 0 0 1rem 0;
    color: #6b7280;
  }

  .upgrade-link {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: transform 0.2s ease;
  }

  .upgrade-link:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .status-header {
      flex-direction: column;
      gap: 1rem;
    }

    .usage-info {
      grid-template-columns: 1fr;
    }
  }
</style>
