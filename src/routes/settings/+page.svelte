<script lang="ts">
  import { user, userProfile } from "$lib/auth";
  import { userProfileService } from "$lib/userProfile";
  import { goto } from "$app/navigation";
  import type { Jahrgangsstufe, Bundesland, KursFach, SchulArt } from "$lib/types";

  let firstName = "";
  let lastName = "";
  let language = "de";
  let theme = "light";
  let notifications = true;
  let jahrgangsstufe: Jahrgangsstufe | "" = "";
  let bundesland: Bundesland | "" = "";
  let schulArt: SchulArt | "" = "";
  let kursFach: KursFach[] = [];
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
    jahrgangsstufe = $userProfile.jahrgangsstufe || "";
    bundesland = $userProfile.bundesland || "";
    schulArt = $userProfile.schulArt || "";
    kursFach = $userProfile.kursFach || [];
  }

  async function handleUpdateProfile() {
    if (!$user || !firstName) {
      errorMessage = "Bitte füllen Sie den Vornamen aus";
      return;
    }

    isSubmitting = true;
    successMessage = "";
    errorMessage = "";
    try {
      const displayName = firstName + (lastName ? ` ${lastName}` : "");
      // Update Firestore profile (only personal info)
      await userProfileService.updateUserProfile($user.uid, {
        firstName,
        lastName,
        displayName,
      });

      // Update preferences
      await userProfileService.updateUserProfile($user.uid, {
        preferences: {
          language,
          theme,
          notifications,
        }
      });
      successMessage = "Profil erfolgreich aktualisiert!";
      setTimeout(() => (successMessage = ""), 3000);
    } catch (error: any) {
      errorMessage = error.message || "Fehler beim Aktualisieren des Profils";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Einstellungen - Tutoro</title>
</svelte:head>

<div class="settings-container">
  <div class="settings-card">
    <h1>Profil-Einstellungen</h1>

    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}

    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}

    <form on:submit|preventDefault={handleUpdateProfile}>
      <div class="section">
        <h2>Persönliche Informationen</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Vorname</label>
            <input type="text" id="firstName" bind:value={firstName} required disabled={isSubmitting} />
          </div>
          <div class="form-group">
            <label for="lastName">Nachname (optional)</label>
            <input type="text" id="lastName" bind:value={lastName} disabled={isSubmitting} />
          </div>
        </div>
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input type="email" id="email" value={$user?.email || ""} disabled readonly />
          <small>E-Mail kann nicht geändert werden</small>
        </div>
      </div>
      <div class="section">
        <h2>Schulinformationen</h2>
        <div class="school-info-grid">
          <div class="school-info-left">
            <div class="info-group">
              <label class="info-label" for="jahrgangsstufe">Jahrgangsstufe</label>
              <div class="info-value compact">
                <select id="jahrgangsstufe" bind:value={jahrgangsstufe} disabled={isSubmitting}>
                  <option value="">Nicht angegeben</option>
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
            </div>

            <div class="info-group">
              <label class="info-label" for="schulArt">Art der Schule</label>
              <div class="info-value compact">
                <select id="schulArt" bind:value={schulArt} disabled={isSubmitting}>
                  <option value="">Nicht angegeben</option>
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
            </div>
          </div>

          <div class="school-info-right">
            <div class="info-group">
              <label class="info-label" for="bundesland">Bundesland</label>
              <div class="info-value bundesland-display" style="display: flex; align-items: center; gap: 1rem;">
                {#if bundesland}
                  <img
                    src={
                      "/countries/german_counties/" +
                      bundesland
                        .toLowerCase()
                        .replaceAll('ü', 'ue')
                        .replaceAll('ä', 'ae')
                        .replaceAll('ö', 'oe')
                        .replaceAll(' ', '-') + ".svg"
                    }
                    alt={bundesland + " Flagge"}
                    style="width: 40px; height: 32px; object-fit: contain; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.10);"
                  />
                {/if}
                <select id="bundesland" bind:value={bundesland} disabled={isSubmitting} style="min-width: 220px;">
                  <option value="">Nicht angegeben</option>
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
            </div>
          </div>
        </div>

        <div class="info-group">
          <label class="info-label" for="interessensfaecher-input">Interessensfächer</label>
          <div class="info-value">
            <input type="hidden" id="interessensfaecher-input" name="interessensfaecher-input" value={kursFach.join(',')} />
            <div class="subject-tags-group" role="group" aria-labelledby="interessensfaecher-input">
              <div class="subject-tags">
                {#each [
                  "Deutsch", "Englisch", "Französisch", "Spanisch", "Latein",
                  "Mathematik", "Physik", "Chemie", "Biologie", "Informatik",
                  "Geschichte", "Erdkunde", "Politik", "Wirtschaft", "Religion", "Ethik", "Philosophie",
                  "Kunst", "Musik", "Sport", "Psychologie", "Pädagogik", "Sonstiges"
                ] as fach}
                  {@const fachasFach = fach as KursFach}
                  <span
                    class="subject-tag selectable {kursFach.includes(fachasFach) ? 'selected' : ''}"
                    role="button"
                    tabindex="0"
                    aria-pressed={kursFach.includes(fachasFach)}
                    on:click={() => kursFach = kursFach.includes(fachasFach) ? kursFach.filter(f => f !== fachasFach) : [...kursFach, fachasFach]}
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { kursFach = kursFach.includes(fachasFach) ? kursFach.filter(f => f !== fachasFach) : [...kursFach, fachasFach]; e.preventDefault(); } }}
                  >{fach}</span>
                {/each}
              </div>
              {#if kursFach.length === 0}
                <div style="color:#dc2626; font-size:0.95rem; margin-top:0.5rem;">Keine Fächer ausgewählt</div>
              {/if}
            </div>
          </div>
        </div>
        <div class="profile-completion-action">
          <div class="profile-edit-options">
            <h3>Profil-Daten bearbeiten</h3>
            <p class="options-description">
              Ändern Sie Ihre Jahrgangsstufe, Art der Schule, Bundesland und Interessensfächer
            </p>

            <div class="edit-buttons">
              <button
                type="button"
                on:click={() => goto("/complete-profile?edit=true")}
                class="btn profile-edit guided"
              >
                <div class="btn-content">
                  <div class="btn-icon">🚀</div>
                  <div class="btn-text">
                    <span class="btn-title">Geführte Bearbeitung</span>
                    <span class="btn-subtitle">Schritt-für-Schritt mit visueller Anleitung</span>
                  </div>
                </div>
                <div class="btn-badge">Empfohlen</div>
              </button>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Einstellungen</h2>

          <div class="form-group">
            <label for="language">Sprache</label>
            <select id="language" bind:value={language} disabled={isSubmitting}>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div class="form-group">
            <label for="theme">Design</label>
            <select id="theme" bind:value={theme} disabled={isSubmitting}>
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
              <option value="auto">Automatisch</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox">
              <input type="checkbox" bind:checked={notifications} disabled={isSubmitting} />
              <span>Benachrichtigungen aktivieren</span>
            </label>
          </div>
        </div>

        <div class="actions">
          <button type="button" on:click={() => goto("/dashboard")} class="btn secondary"> Abbrechen </button>
          <button type="submit" class="btn primary" disabled={isSubmitting}>
            {isSubmitting ? "Wird aktualisiert..." : "Profil aktualisieren"}
          </button>
        </div>
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

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
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

  .info-group {
    margin-bottom: 1rem;
  }

  .info-group .info-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .info-value {
    padding: 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #6b7280;
    font-size: 1rem;
  }

  .info-value.compact {
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
  }

  .school-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .school-info-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .school-info-right {
    display: flex;
    align-items: start;
  }

  .school-info-right .info-group {
    width: 100%;
    margin-bottom: 0;
  }

  .bundesland-display {
    padding: 0;
    background: transparent;
    border: none;
  }

  .subject-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .subject-tag {
    background: #ddd6fe;
    color: #5b21b6;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .profile-completion-action {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px solid #6366f1;
    border-radius: 12px;
    text-align: center;
  }
  .profile-completion-action button {
    margin-bottom: 0.75rem;
  }

  .profile-edit-options {
    text-align: center;
    margin: 1.5rem 0;
  }

  .profile-edit-options h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem;
  }

  .options-description {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  .edit-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .btn.profile-edit {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
    text-align: center;
    min-height: 120px;
  }

  .btn.profile-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .btn.profile-edit.guided {
    border-color: #7c3aed;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  }

  .btn.profile-edit.guided:hover {
    border-color: #7c3aed;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.2);
  }

  .btn-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .btn-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .btn-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn-title {
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
  }

  .btn-subtitle {
    font-weight: 400;
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.3;
  }

  .btn-badge {
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
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
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
  /* Verbesserte Dropdown-Styles für alle Selects */
  .form-group select,
  .info-value select {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    background: #f9fafb url('data:image/svg+xml;utf8,<svg fill="%236b7280" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>') no-repeat right 0.75rem center/1.25rem 1.25rem;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    color: #374151;
    min-width: 180px;
    max-width: 100%;
  }
  .form-group select:focus,
  .info-value select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    background-color: #fff;
  }
  .form-group select:disabled,
  .info-value select:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.8;
  }
  /* Dropdown Arrow für dunklen Hintergrund besser sichtbar */
  .info-value select {
    background-color: #f9fafb;
  }
  @media (max-width: 640px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .school-info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .actions {
      flex-direction: column;
    }

    .edit-buttons {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .btn.profile-edit {
      padding: 1rem;
      min-height: 100px;
    }

    .btn-icon {
      font-size: 1.75rem;
    }

    .btn-title {
      font-size: 0.9rem;
    }

    .btn-subtitle {
      font-size: 0.75rem;
    }

    .subject-tags {
      gap: 0.25rem;
    }

    .subject-tag {
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
    }
  }
</style>
