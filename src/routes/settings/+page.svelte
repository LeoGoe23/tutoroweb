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
              <span class="info-label">Jahrgangsstufe</span>
              <div class="info-value compact">
                {#if jahrgangsstufe === "Studium"}
                  Studium
                {:else if jahrgangsstufe === "Erwachsenenbildung"}
                  Erwachsenenbildung
                {:else if jahrgangsstufe}
                  {jahrgangsstufe}. Klasse
                {:else}
                  Nicht angegeben
                {/if}
              </div>
            </div>

            <div class="info-group">
              <span class="info-label">Art der Schule</span>
              <div class="info-value compact">
                {schulArt || "Nicht angegeben"}
              </div>
            </div>
          </div>

          <div class="school-info-right">
            <div class="info-group">
              <span class="info-label">Bundesland</span>
              <div class="info-value bundesland-display">
                {#if bundesland}
                  <div class="bundesland-card">
                    <div class="bundesland-flag">
                      {#if bundesland === "Baden-Württemberg"}
                        <img src="/countries/german_counties/baden-wuerttemberg.svg" alt="Baden-Württemberg Flagge" />
                      {:else if bundesland === "Bayern"}
                        <img src="/countries/german_counties/bayern.svg" alt="Bayern Flagge" />
                      {:else if bundesland === "Berlin"}
                        <img src="/countries/german_counties/berlin.svg" alt="Berlin Flagge" />
                      {:else if bundesland === "Brandenburg"}
                        <img src="/countries/german_counties/brandenburg.svg" alt="Brandenburg Flagge" />
                      {:else if bundesland === "Bremen"}
                        <img src="/countries/german_counties/bremen.svg" alt="Bremen Flagge" />
                      {:else if bundesland === "Hamburg"}
                        <img src="/countries/german_counties/hamburg.svg" alt="Hamburg Flagge" />
                      {:else if bundesland === "Hessen"}
                        <img src="/countries/german_counties/hessen.svg" alt="Hessen Flagge" />
                      {:else if bundesland === "Mecklenburg-Vorpommern"}
                        <img
                          src="/countries/german_counties/mecklenburg-vorpommern.svg"
                          alt="Mecklenburg-Vorpommern Flagge"
                        />
                      {:else if bundesland === "Niedersachsen"}
                        <img src="/countries/german_counties/niedersachsen.svg" alt="Niedersachsen Flagge" />
                      {:else if bundesland === "Nordrhein-Westfalen"}
                        <img
                          src="/countries/german_counties/nordrhein-westfalen.svg"
                          alt="Nordrhein-Westfalen Flagge"
                        />
                      {:else if bundesland === "Rheinland-Pfalz"}
                        <img src="/countries/german_counties/rheinland-pfalz.svg" alt="Rheinland-Pfalz Flagge" />
                      {:else if bundesland === "Saarland"}
                        <img src="/countries/german_counties/saarland.svg" alt="Saarland Flagge" />
                      {:else if bundesland === "Sachsen"}
                        <img src="/countries/german_counties/sachsen.svg" alt="Sachsen Flagge" />
                      {:else if bundesland === "Sachsen-Anhalt"}
                        <img src="/countries/german_counties/sachsen-anhalt.svg" alt="Sachsen-Anhalt Flagge" />
                      {:else if bundesland === "Schleswig-Holstein"}
                        <img src="/countries/german_counties/schleswig-holstein.svg" alt="Schleswig-Holstein Flagge" />
                      {:else if bundesland === "Thüringen"}
                        <img src="/countries/german_counties/thueringen.svg" alt="Thüringen Flagge" />
                      {:else}
                        🇩🇪
                      {/if}
                    </div>
                    <div class="bundesland-name">
                      {bundesland}
                    </div>
                  </div>
                {:else}
                  <div class="bundesland-placeholder">
                    <div class="bundesland-flag">🇩🇪</div>
                    <div class="bundesland-name">Nicht angegeben</div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <div class="info-group">
          <span class="info-label">Interessensfächer</span>
          <div class="info-value">
            {#if kursFach && kursFach.length > 0}
              <div class="subject-tags">
                {#each kursFach as fach}
                  <span class="subject-tag">{fach}</span>
                {/each}
              </div>
            {:else}
              Keine Fächer ausgewählt
            {/if}
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
                on:click={() => goto("/complete-profile/guided?edit=true")}
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

  .bundesland-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: #f3f4f6; /* dezenter grauer Hintergrund */
    border: 1.5px solid #d1d5db; /* dezente graue Umrandung */
    border-radius: 12px;
    transition: none;
    cursor: default; /* Cursor zeigt Nicht-Interaktivität */
    opacity: 1;
    box-shadow: none;
    position: relative;
  }

  .bundesland-card:hover {
    transform: none;
    box-shadow: none;
  }

  .bundesland-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    opacity: 0.7;
  }

  .bundesland-flag {
    margin-bottom: 0.5rem;
    line-height: 1;
    width: 100px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bundesland-flag img {
    max-width: 100px;
    max-height: 80px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
  }

  .bundesland-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
  }

  .bundesland-placeholder .bundesland-name {
    color: #6b7280;
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
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
