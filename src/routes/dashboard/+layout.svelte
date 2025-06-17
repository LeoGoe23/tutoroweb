<script lang="ts">
  import { user, loading } from "$lib/auth";
  import { goto } from "$app/navigation";

  // Redirect if not authenticated
  $: if (!$loading && !$user) {
    goto("/auth");
  }
</script>

{#if $loading}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
{:else if $user}
  <slot />
{:else}
  <div class="auth-required">
    <p>Authentication required. Redirecting...</p>
  </div>
{/if}

<style>
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .auth-required {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    color: #6b7280;
  }
</style>
