<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { user, userProfile } from "$lib/auth";
  import { userProfileService } from "$lib/userProfile";
  import type { Jahrgangsstufe, Bundesland, KursFach, SchulArt } from "$lib/types";

  // Form state
  let jahrgangsstufe: Jahrgangsstufe | "" = "";
  let bundesland: Bundesland | "" = "";
  let schulArt: SchulArt | "" = "";
  let kursFach: KursFach[] = [];
  let isSubmitting = false;
  let error = "";
  // Check if we're in edit mode
  $: isEditMode = $page.url.searchParams.get("edit") === "true";

  // Handle navigation and data loading
  onMount(() => {
    // Redirect if not authenticated
    if (!$user) {
      goto("/auth");
      return;
    }

    // Redirect if already completed (unless in edit mode)
    if ($userProfile?.profileCompleted && !isEditMode) {
      goto("/dashboard");
      return;
    }
  });

  // Load existing data in edit mode
  $: if (isEditMode && $userProfile) {
    jahrgangsstufe = $userProfile.jahrgangsstufe || "";
    bundesland = $userProfile.bundesland || "";
    schulArt = $userProfile.schulArt || "";
    kursFach = $userProfile.kursFach || [];
  }

  // Handle form submission
  async function handleSubmit() {
    if (isSubmitting) return; // Validation
    if (!jahrgangsstufe || !schulArt || !bundesland || kursFach.length === 0) {
      error = "Bitte fülle alle Felder aus und wähle mindestens ein Fach.";
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      if (!$user) return;
      const updatedProfile = await userProfileService.completeUserProfile($user.uid, {
        jahrgangsstufe: jahrgangsstufe as Jahrgangsstufe,
        bundesland: bundesland as Bundesland,
        schulArt: schulArt as SchulArt,
        kursFach,
      }); // Update the user profile in the auth store
      if (updatedProfile) {
        userProfile.set(updatedProfile);
      } // Small delay to ensure store updates propagate
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect based on mode
      if (isEditMode) {
        goto("/settings");
      } else {
        goto("/dashboard");
      }
    } catch (err: any) {
      console.error("Profile completion error:", err);
      error = "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Profil vervollständigen - Tutoro</title>
</svelte:head>

<div class="profile-completion-container">
  <div class="profile-completion-card">
    <div class="header">
      <div class="logo-section">
        <img src="/svgs/logo.svg" alt="Tutoro Logo" class="logo" />
        <h1>Tutoro</h1>
      </div>
      <h2>{isEditMode ? "Profil-Daten bearbeiten" : "Profil vervollständigen"}</h2>
      <p class="subtitle">
        {isEditMode
          ? "Aktualisieren Sie Ihre Schul- und Interessensinformationen."
          : "Erzähle uns ein wenig über dich, damit wir dir die beste Lernerfahrung bieten können."}
      </p>

      {#if !isEditMode}
        <div class="setup-options">
          <a href="/complete-profile/guided" class="setup-option guided">
            <div class="option-icon">🚀</div>
            <h3>Geführte Einrichtung</h3>
            <p>Schritt-für-Schritt durch dein Profil mit visueller Anleitung</p>
            <span class="option-badge">Empfohlen</span>
          </a>
          <div class="setup-option current">
            <div class="option-icon">⚡</div>
            <h3>Schnell-Einrichtung</h3>
            <p>Alle Daten auf einer Seite eingeben</p>
          </div>
        </div>
        <div class="divider">
          <span>oder nutze die Schnell-Einrichtung</span>
        </div>
      {/if}
    </div>

    <form class="completion-form" on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}
      <div class="form-group">
        <label for="jahrgangsstufe">Jahrgangsstufe *</label>
        <select id="jahrgangsstufe" bind:value={jahrgangsstufe} required disabled={isSubmitting}>
          <option value="">Bitte wählen...</option>
          <option value="5">5. Klasse</option>
          <option value="6">6. Klasse</option>
          <option value="7">7. Klasse</option>
          <option value="8">8. Klasse</option>
          <option value="9">9. Klasse</option>
          <option value="10">10. Klasse</option>
          <option value="11">11. Klasse</option>
          <option value="12">12. Klasse</option>
          <option value="13">13. Klasse</option>
          <option value="Studium">Studium</option>
          <option value="Erwachsenenbildung">Erwachsenenbildung</option>
        </select>
      </div>

      <div class="form-group">
        <label for="schulart">Art der Schule *</label>
        <select id="schulart" bind:value={schulArt} required disabled={isSubmitting}>
          <option value="">Bitte wählen...</option>
          <option value="Grundschule">Grundschule</option>
          <option value="Hauptschule">Hauptschule</option>
          <option value="Realschule">Realschule</option>
          <option value="Gesamtschule">Gesamtschule</option>
          <option value="Gymnasium">Gymnasium</option>
          <option value="Berufsschule">Berufsschule</option>
          <option value="Berufsoberschule">Berufsoberschule</option>
          <option value="Fachoberschule">Fachoberschule</option>
          <option value="Fachhochschule">Fachhochschule</option>
          <option value="Universität">Universität</option>
          <option value="Privatschule">Privatschule</option>
          <option value="Waldorfschule">Waldorfschule</option>
          <option value="Montessori-Schule">Montessori-Schule</option>
          <option value="Internationale Schule">Internationale Schule</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
      </div>

      <div class="form-group">
        <label for="bundesland">Bundesland *</label>
        <select id="bundesland" bind:value={bundesland} required disabled={isSubmitting}>
          <option value="">Bitte wählen...</option>
          <option value="Baden-Württemberg">Baden-Württemberg</option>
          <option value="Bayern">Bayern</option>
          <option value="Berlin">Berlin</option>
          <option value="Brandenburg">Brandenburg</option>
          <option value="Bremen">Bremen</option>
          <option value="Hamburg">Hamburg</option>
          <option value="Hessen">Hessen</option>
          <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
          <option value="Niedersachsen">Niedersachsen</option>
          <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
          <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
          <option value="Saarland">Saarland</option>
          <option value="Sachsen">Sachsen</option>
          <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
          <option value="Schleswig-Holstein">Schleswig-Holstein</option>
          <option value="Thüringen">Thüringen</option>
        </select>
      </div>
      <div class="form-group">
        <fieldset>
          <legend>Interessensfächer * (mindestens eines wählen)</legend>
          <div class="subject-grid">
            {#each ["Mathematik", "Deutsch", "Englisch", "Französisch", "Spanisch", "Latein", "Physik", "Chemie", "Biologie", "Erdkunde", "Geschichte", "Politik", "Wirtschaft", "Religion", "Ethik", "Kunst", "Musik", "Sport", "Informatik", "Philosophie", "Psychologie", "Pädagogik", "Sonstiges"] as fach}
              <label class="subject-checkbox">
                <input type="checkbox" value={fach} bind:group={kursFach} disabled={isSubmitting} />
                <span>{fach}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      </div>
      <button type="submit" class="complete-btn" disabled={isSubmitting}>
        {#if isEditMode}
          {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
        {:else}
          {isSubmitting ? "Profil wird vervollständigt..." : "Profil vervollständigen"}
        {/if}
      </button>
    </form>
  </div>
</div>

<style>
  .profile-completion-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .profile-completion-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2.5rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideInUp {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .logo {
    height: 2.5rem;
    width: auto;
  }

  .logo-section h1 {
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  .subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }

  .setup-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 2rem 0 1.5rem;
  }

  .setup-option {
    padding: 1.5rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    text-align: center;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
  }

  .setup-option.guided {
    border-color: #7c3aed;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  }

  .setup-option.guided:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(124, 58, 237, 0.2);
    border-color: #7c3aed;
  }

  .setup-option.current {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  .option-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .setup-option h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem;
  }

  .setup-option p {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  .option-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .divider {
    text-align: center;
    margin: 1.5rem 0;
    position: relative;
  }

  .divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
    z-index: 1;
  }

  .divider span {
    background: white;
    padding: 0 1rem;
    color: #6b7280;
    font-size: 0.85rem;
    position: relative;
    z-index: 2;
  }

  .completion-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .form-group select {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: white;
  }

  .form-group select:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }

  .subject-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: #fafafa;
  }

  .subject-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .subject-checkbox:hover {
    background: #f3f4f6;
  }

  .subject-checkbox input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: #a855f7;
  }

  .complete-btn {
    background: linear-gradient(135deg, #a855f7, #8b5cf6);
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .complete-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
  }

  .complete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.9rem;
    text-align: center;
  }

  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }

  legend {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    padding: 0;
  }
  @media (max-width: 640px) {
    .profile-completion-card {
      padding: 2rem 1.5rem;
      margin: 1rem;
    }

    .setup-options {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .setup-option {
      padding: 1.25rem 1rem;
    }

    .option-icon {
      font-size: 1.75rem;
    }

    .subject-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      max-height: 150px;
    }
  }
</style>
