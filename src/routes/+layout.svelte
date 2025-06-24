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
      <a href="/" class="logo">
        <div class="logo-icon">
          <img src="/svgs/logo.svg" alt="Tutoro Logo" />
        </div>
        <span class="brand-name">Tutoro</span>
      </a>
    </div>
    <div class="nav-actions">
      {#if $loading}
        <div class="nav-btn loading">Wird geladen...</div>
      {:else if $user}
        <div class="user-dropdown">
          <button class="user-trigger">
            <span class="user-name">
              {$userProfile?.firstName || $user?.displayName || $user?.email}
            </span>
            <svg
              class="dropdown-arrow"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          <div class="user-menu">
            <div class="user-profile-section">
              <div class="user-full-name">
                {#if $userProfile?.firstName}
                  {$userProfile.firstName}
                  {#if $userProfile?.lastName}
                    {$userProfile.lastName}{/if}
                {:else}
                  {$user?.displayName || "Benutzer"}
                {/if}
              </div>
              <div class="user-email">{$user?.email}</div>
              <div class="user-subscription">
                {#if $userProfile?.subscription}
                  {$userProfile.subscription} Plan
                {:else}
                  Kostenlos
                {/if}
              </div>
            </div>
            <hr class="menu-divider" />
            <a href="/dashboard" class="menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </a>
            <a href="/subscription" class="menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Abonnement
            </a>
            <a href="/settings" class="menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                ></path>
              </svg>
              Einstellungen
            </a>
            <hr class="menu-divider" />
            <button on:click={handleLogout} class="menu-item logout-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Abmelden
            </button>
          </div>
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
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
  }

  .logo:hover {
    opacity: 0.8;
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

  .user-dropdown {
    position: relative;
    display: inline-block;
  }

  .user-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
  }

  .user-trigger:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .user-trigger:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .user-name {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-arrow {
    transition: transform 0.2s ease;
    color: #6b7280;
  }

  .user-dropdown:hover .dropdown-arrow {
    transform: rotate(180deg);
  }
  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    min-width: 280px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 1000;
  }
  .user-dropdown:hover .user-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .user-profile-section {
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px 8px 0 0;
  }

  .user-full-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    word-break: break-word;
  }

  .user-subscription {
    display: inline-block;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #374151;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover {
    background: #f8fafc;
    color: #1f2937;
  }

  .menu-item svg {
    color: #6b7280;
    flex-shrink: 0;
  }

  .menu-item:hover svg {
    color: #374151;
  }

  .menu-divider {
    border: none;
    height: 1px;
    background: #e5e7eb;
    margin: 0.5rem 0;
  }

  .logout-item {
    color: #dc2626;
  }

  .logout-item:hover {
    background: #fef2f2;
    color: #b91c1c;
  }

  .logout-item svg {
    color: #dc2626;
  }

  .logout-item:hover svg {
    color: #b91c1c;
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

    .user-trigger {
      padding: 0.6rem 0.8rem;
      font-size: 0.8rem;
    }

    .user-name {
      max-width: 100px;
    }
    .user-menu {
      min-width: 260px;
      right: -10px;
    }

    .user-profile-section {
      padding: 0.75rem;
    }

    .user-full-name {
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.8rem;
    }

    .user-subscription {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }
  }
</style>
