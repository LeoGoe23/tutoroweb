<script lang="ts">
  import { user, userProfile } from "$lib/auth";
  import { userProfileService } from "$lib/userProfile";
  import { goto } from "$app/navigation";

  let firstName = "";
  let lastName = "";
  let language = "de";
  let theme = "light";
  let notifications = true;
  let isSubmitting = false;
  let successMessage = "";
  let errorMessage = "";

  // Load current profile data
  $: if ($userProfile) {
    firstName = $userProfile.firstName || "";
    lastName = $userProfile.lastName || "";
    language = $userProfile.preferences?.language || "de";
    theme = $userProfile.preferences?.theme || "light";
    notifications = $userProfile.preferences?.notifications ?? true;
  }

  async function handleUpdateProfile() {
    if (!$user || !firstName || !lastName) {
      errorMessage = "Please fill in all required fields";
      return;
    }

    isSubmitting = true;
    successMessage = "";
    errorMessage = "";

    try {
      const displayName = `${firstName} ${lastName}`;

      // Update Firestore profile
      await userProfileService.updateUserProfile($user.uid, {
        firstName,
        lastName,
        displayName,
      });

      // Update preferences
      await userProfileService.updateUserPreferences($user.uid, {
        language,
        theme,
        notifications,
      });

      successMessage = "Profile updated successfully!";
      setTimeout(() => (successMessage = ""), 3000);
    } catch (error: any) {
      errorMessage = error.message || "Failed to update profile";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Settings - Tutoro</title>
</svelte:head>

<div class="settings-container">
  <div class="settings-card">
    <h1>Profile Settings</h1>

    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}

    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}

    <form on:submit|preventDefault={handleUpdateProfile}>
      <div class="section">
        <h2>Personal Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" bind:value={firstName} required disabled={isSubmitting} />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" bind:value={lastName} required disabled={isSubmitting} />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" value={$user?.email || ""} disabled readonly />
          <small>Email cannot be changed</small>
        </div>
      </div>

      <div class="section">
        <h2>Preferences</h2>

        <div class="form-group">
          <label for="language">Language</label>
          <select id="language" bind:value={language} disabled={isSubmitting}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div class="form-group">
          <label for="theme">Theme</label>
          <select id="theme" bind:value={theme} disabled={isSubmitting}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox">
            <input type="checkbox" bind:checked={notifications} disabled={isSubmitting} />
            <span>Enable notifications</span>
          </label>
        </div>
      </div>

      <div class="actions">
        <button type="button" on:click={() => goto("/dashboard")} class="btn secondary"> Cancel </button>
        <button type="submit" class="btn primary" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .settings-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .settings-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  h1 {
    color: #1f2937;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  h2 {
    color: #374151;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  .section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .section:last-of-type {
    border-bottom: none;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-group {
    flex: 1;
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .form-group input:disabled {
    background: #f9fafb;
    color: #6b7280;
  }

  .form-group small {
    color: #6b7280;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }

  .checkbox-group {
    margin-top: 1rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #374151;
  }

  .checkbox input {
    width: auto;
    margin: 0;
  }

  .success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn.primary {
    background: #6366f1;
    color: white;
  }

  .btn.primary:hover:not(:disabled) {
    background: #5338f1;
  }

  .btn.secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .btn.secondary:hover {
    background: #e5e7eb;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .actions {
      flex-direction: column;
    }
  }
</style>
