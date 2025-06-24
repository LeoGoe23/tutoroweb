<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { user, userProfile, loading, authStore } from "$lib/auth";

  // Handle logout
  async function handleLogout() {
    try {
      await authStore.signOut();
      goto("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Redirect to auth if accessing protected route while not authenticated (only on client side)
  $: if (browser && !$loading && $page.data.isProtectedRoute && !$user) {
    goto("/auth");
  }
</script>

<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <div class="logo">
        <div class="logo-icon">
          <img src="/svgs/logo.svg" alt="Tutoro Logo" />
        </div>
        <span class="brand-name">Tutoro</span>
      </div>
    </div>
    <div class="nav-actions">
      {#if $loading}
        <div class="nav-btn loading">Wird geladen...</div>
      {:else if $user}
        <a href="/dashboard" class="nav-btn dashboard">Dashboard</a>
        <a href="/subscription" class="nav-btn subscription">Abonnement</a>
        <a href="/settings" class="nav-btn settings">Einstellungen</a>
        <div class="user-info">
          <span class="user-email">
            {$userProfile?.firstName || $user?.displayName || $user?.email}
          </span>
          <button on:click={handleLogout} class="nav-btn logout">Abmelden</button>
        </div>
      {:else}
        <a href="/auth" class="nav-btn login">Anmelden</a>
        <a href="/auth" class="nav-btn register">Kostenlos testen</a>
      {/if}
    </div>
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f8f9fa;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .logo-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-left: 0.3rem;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .nav-btn {
    padding: 0.6rem 1.5rem;
    border-radius: 1.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .nav-btn.login {
    background: transparent;
    color: #6366f1;
    border: 2px solid transparent;
  }

  .nav-btn.login:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
  }

  .nav-btn.register {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }
  .nav-btn.register:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .nav-btn.dashboard {
    background: #10b981;
    color: white;
    border: 2px solid transparent;
  }
  .nav-btn.dashboard:hover {
    background: #059669;
  }

  .nav-btn.subscription {
    background: #8b5cf6;
    color: white;
    border: 2px solid transparent;
  }

  .nav-btn.subscription:hover {
    background: #7c3aed;
  }

  .nav-btn.settings {
    background: #6b7280;
    color: white;
    border: 2px solid transparent;
  }

  .nav-btn.settings:hover {
    background: #4b5563;
  }

  .nav-btn.logout {
    background: #ef4444;
    color: white;
    border: 2px solid transparent;
  }

  .nav-btn.logout:hover {
    background: #dc2626;
  }

  .nav-btn.loading {
    background: #6b7280;
    color: white;
    cursor: default;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .user-email {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  main {
    min-height: calc(100vh - 70px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-container {
      padding: 0 1rem;
    }

    .brand-name {
      font-size: 1.3rem;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }
</style>
