<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { user, userProfile } from "$lib/auth";
  import { userProfileService } from "$lib/userProfile";
  import { BUNDESLAENDER, JAHRGANGSSTUFEN, SCHULARTEN, SUBJECT_CATEGORIES } from "$lib/schoolData";
  import type { Jahrgangsstufe, Bundesland, KursFach, SchulArt } from "$lib/types";

  // Step management
  let currentStep = 1;
  const totalSteps = 5;

  // Form state
  let firstName = "";
  let lastName = "";
  let jahrgangsstufe: Jahrgangsstufe | "" = "";
  let bundesland: Bundesland | "" = "";
  let schulArt: SchulArt | "" = "";
  let kursFach: KursFach[] = [];
  let learningGoals = "";

  let isSubmitting = false;
  let error = ""; // Check if we're in edit mode
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

    // Load existing data in edit mode
    if (isEditMode && $userProfile) {
      firstName = $userProfile.firstName || "";
      lastName = $userProfile.lastName || "";
      jahrgangsstufe = $userProfile.jahrgangsstufe || "";
      bundesland = $userProfile.bundesland || "";
      schulArt = $userProfile.schulArt || "";
      kursFach = $userProfile.kursFach || [];
      learningGoals = $userProfile.learningGoals || "";
    }
  });

  // Progress calculation
  $: progress = (currentStep / totalSteps) * 100; // Step validation
  let canProceed: Record<number, boolean>;
  $: {
    canProceed = {
      1: firstName.trim() !== "" && lastName.trim() !== "",
      2: jahrgangsstufe !== "" && schulArt !== "",
      3: bundesland !== "",
      4: kursFach.length > 0,
      5: true,
    };
  }

  // Navigation functions
  function nextStep() {
    if (currentStep < totalSteps && canProceed[currentStep]) {
      currentStep++;
      error = "";
    }
  }

  function previousStep() {
    if (currentStep > 1) {
      currentStep--;
      error = "";
    }
  }

  function goToStep(step: number) {
    // Only allow going back or to the next step if current step is valid
    if (step <= currentStep || (step === currentStep + 1 && canProceed[currentStep])) {
      currentStep = step;
      error = "";
    }
  }

  // Handle form submission
  async function handleSubmit() {
    if (isSubmitting) return;

    // Validate all required fields
    if (!firstName.trim() || !lastName.trim() || !jahrgangsstufe || !schulArt || !bundesland || kursFach.length === 0) {
      error = "Bitte fülle alle erforderlichen Felder aus.";
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      if (!$user) return;

      const updatedProfile = await userProfileService.completeUserProfile($user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jahrgangsstufe: jahrgangsstufe as Jahrgangsstufe,
        bundesland: bundesland as Bundesland,
        schulArt: schulArt as SchulArt,
        kursFach,
        learningGoals: learningGoals.trim() || undefined,
      });

      // Update the user profile in the auth store
      if (updatedProfile) {
        userProfile.set(updatedProfile);
      }

      // Small delay to ensure store updates propagate
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
  <title>Geführte Profil-Einrichtung - Tutoro</title>
</svelte:head>

<div class="guided-setup-container">
  <!-- Progress Header -->
  <header class="progress-header">
    <div class="header-content">
      <div class="logo-section">
        <img src="/svgs/logo.svg" alt="Tutoro Logo" class="logo" />
        <span class="brand-name">Tutoro</span>
      </div>
      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: {progress}%"></div>
        </div>
        <span class="progress-text">Schritt {currentStep} von {totalSteps}</span>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="setup-main">
    <div class="step-container">
      <!-- Step Navigation Dots -->
      <div class="step-dots">
        {#each Array(totalSteps) as _, i}
          <button
            class="step-dot"
            class:active={i + 1 === currentStep}
            class:completed={i + 1 < currentStep}
            class:available={i + 1 <= currentStep || canProceed[i]}
            on:click={() => goToStep(i + 1)}
            disabled={i + 1 > currentStep && !canProceed[i]}
          >
            {#if i + 1 < currentStep}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            {:else}
              {i + 1}
            {/if}
          </button>
        {/each}
      </div>

      <!-- Step Content -->
      <div class="step-content">
        {#if currentStep === 1}
          <div class="step-header">
            <h1>Willkommen bei Tutoro! 👋</h1>
            <p>Lass uns dich kennenlernen. Wie heißt du?</p>
          </div>

          <div class="form-content">
            <div class="name-fields">
              <div class="form-group">
                <label for="firstName">Vorname *</label>
                <input
                  type="text"
                  id="firstName"
                  bind:value={firstName}
                  placeholder="Dein Vorname"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="lastName">Nachname *</label>
                <input
                  type="text"
                  id="lastName"
                  bind:value={lastName}
                  placeholder="Dein Nachname"
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>
        {:else if currentStep === 2}
          <div class="step-header">
            <h1>Deine Schullaufbahn 🎓</h1>
            <p>Erzähle uns, in welcher Jahrgangsstufe du bist und welche Schulart du besuchst.</p>
          </div>

          <div class="form-content">
            <div class="form-group">
              <label for="jahrgangsstufe">Jahrgangsstufe *</label>
              <select id="jahrgangsstufe" bind:value={jahrgangsstufe} class="form-select" required>
                <option value="">Wähle deine Jahrgangsstufe</option>
                {#each JAHRGANGSSTUFEN as stufe}
                  <option value={stufe}>{stufe === 'Studium' || stufe === 'Erwachsenenbildung' ? stufe : `${stufe}. Klasse`}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="schulArt">Schulart *</label>
              <select id="schulArt" bind:value={schulArt} class="form-select" required>
                <option value="">Wähle deine Schulart</option>
                {#each SCHULARTEN as art}
                  <option value={art}>{art}</option>
                {/each}
              </select>
            </div>
          </div>
        {:else if currentStep === 3}
          <div class="step-header">
            <h1>Dein Bundesland 🗺️</h1>
            <p>In welchem Bundesland gehst du zur Schule?</p>
          </div>

          <div class="form-content">
            <div class="bundesland-grid">
              {#each BUNDESLAENDER as land}
                <button
                  type="button"
                  class="bundesland-option"
                  class:selected={bundesland === land}
                  on:click={() => (bundesland = land as Bundesland)}
                >
                  <img
                    src="/countries/german_counties/{land
                      .toLowerCase()
                      .replaceAll('ü', 'ue')
                      .replaceAll('ä', 'ae')
                      .replaceAll('ö', 'oe')
                      .replaceAll(' ', '-')}.svg"
                    alt={land}
                    class="bundesland-icon"
                  />
                  <span>{land}</span>
                </button>
              {/each}
            </div>
          </div>
        {:else if currentStep === 4}
          <div class="step-header">
            <h1>Deine Lieblingsfächer 📚</h1>
            <p>Wähle die Fächer aus, für die du Nachhilfe suchst oder die dich interessieren.</p>
          </div>

          <div class="form-content">
            <div class="subjects-container">
              {#each Object.entries(SUBJECT_CATEGORIES) as [category, subjects]}
                <div class="subject-category">
                  <h3 class="category-title">{category}</h3>
                  <div class="subject-chips">
                    {#each subjects as subject}
                      <button
                        type="button"
                        class="subject-chip"
                        class:selected={kursFach.includes(subject as KursFach)}
                        on:click={() => {
                          const subjectAsKursFach = subject as KursFach;
                          if (kursFach.includes(subjectAsKursFach)) {
                            kursFach = kursFach.filter((f) => f !== subjectAsKursFach);
                          } else {
                            kursFach = [...kursFach, subjectAsKursFach];
                          }
                        }}
                      >
                        {subject}
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
            <div class="selected-count">
              {kursFach.length} Fächer ausgewählt
            </div>
          </div>
        {:else if currentStep === 5}
          <div class="step-header">
            <h1>Deine Lernziele 🎯</h1>
            <p>Was möchtest du erreichen? (Optional, aber hilft uns dabei, dir bessere Inhalte zu zeigen)</p>
          </div>

          <div class="form-content">
            <div class="form-group">
              <label for="learningGoals">Beschreibe deine Ziele</label>
              <textarea
                id="learningGoals"
                bind:value={learningGoals}
                placeholder="z.B. Meine Noten in Mathematik verbessern, mich auf das Abitur vorbereiten, ein bestimmtes Thema verstehen..."
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="goals-suggestions">
              <p class="suggestions-title">Häufige Ziele:</p>
              <div class="suggestion-chips">
                {#each ["Noten verbessern", "Abitur-Vorbereitung", "Nachhilfe geben", "Neue Fächer lernen", "Verständnis vertiefen"] as suggestion}
                  <button
                    type="button"
                    class="suggestion-chip"
                    on:click={() => {
                      if (!learningGoals.includes(suggestion)) {
                        learningGoals = learningGoals ? `${learningGoals}, ${suggestion}` : suggestion;
                      }
                    }}
                  >
                    {suggestion}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Error Message -->
        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="step-navigation">
          {#if currentStep > 1}
            <button type="button" class="nav-btn secondary" on:click={previousStep}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
              Zurück
            </button>
          {/if}

          <div class="nav-spacer"></div>

          {#if currentStep < totalSteps}
            <button type="button" class="nav-btn primary" disabled={!canProceed[currentStep]} on:click={nextStep}>
              Weiter
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          {:else}
            <button
              type="button"
              class="nav-btn primary complete"
              disabled={isSubmitting || !canProceed[currentStep]}
              on:click={handleSubmit}
            >
              {#if isSubmitting}
                <svg
                  class="loading-spinner"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Wird gespeichert...
              {:else}
                {isEditMode ? "Änderungen speichern" : "Profil vervollständigen"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              {/if}
            </button>
          {/if}
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .guided-setup-container {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
  }
  /* Progress Header */
  .progress-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo {
    width: 32px;
    height: 32px;
  }

  .brand-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .progress-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar-container {
    width: 200px;
    height: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4b5563;
  } /* Main Setup Area */
  .setup-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    padding-top: 8rem; /* Add space for fixed header */
    overflow-y: auto;
    max-height: calc(100vh - 6rem); /* Account for header */
  }

  .step-container {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 700px;
    overflow: hidden;
  }

  /* Step Dots Navigation */
  .step-dots {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 2rem 1rem;
    background: #f8fafc;
  }

  .step-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .step-dot:hover:not(:disabled) {
    transform: scale(1.05);
    border-color: #667eea;
  }

  .step-dot.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .step-dot.completed {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .step-dot:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Step Content */
  .step-content {
    padding: 2rem 3rem 3rem;
  }

  .step-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .step-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.75rem;
  }

  .step-header p {
    font-size: 1.1rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }

  .form-content {
    max-width: 500px;
    margin: 0 auto;
  }

  /* Form Elements */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: white;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
  }

  .name-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* Bundesland Grid */
  .bundesland-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .bundesland-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .bundesland-option:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .bundesland-option.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  .bundesland-icon {
    width: 32px;
    height: 32px;
    filter: grayscale(100%);
    transition: filter 0.2s ease;
  }

  .bundesland-option.selected .bundesland-icon {
    filter: brightness(0) invert(1);
  }

  /* Subjects */
  .subjects-container {
    max-height: 450px;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .subject-category {
    margin-bottom: 2rem;
  }

  .category-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-title::before {
    content: "";
    width: 4px;
    height: 4px;
    background: #667eea;
    border-radius: 50%;
  }

  .subject-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .subject-chip {
    padding: 0.75rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 2rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    color: #374151;
  }

  .subject-chip:hover {
    border-color: #667eea;
    transform: translateY(-1px);
  }

  .subject-chip.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .selected-count {
    text-align: center;
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f0f9ff;
    border-radius: 0.75rem;
    color: #0369a1;
    font-weight: 600;
  }

  /* Goals Suggestions */
  .goals-suggestions {
    margin-top: 1.5rem;
  }

  .suggestions-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .suggestion-chip {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 1.5rem;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    color: #6b7280;
  }

  .suggestion-chip:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  /* Navigation */
  .step-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
  }

  .nav-spacer {
    flex: 1;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-btn.secondary {
    background: #f3f4f6;
    color: #6b7280;
    border: 2px solid transparent;
  }

  .nav-btn.secondary:hover:not(:disabled) {
    background: #e5e7eb;
    color: #374151;
  }

  .nav-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .nav-btn.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .nav-btn.complete {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  .nav-btn.complete:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }

  /* Loading Spinner */
  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Error Message */
  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.75rem;
    margin-top: 1rem;
    text-align: center;
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .progress-header {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .progress-bar-container {
      width: 150px;
    }
    .setup-main {
      padding: 1rem;
      padding-top: 9rem; /* Increased padding for mobile with fixed header */
      max-height: calc(100vh - 7rem); /* Adjust for mobile header */
    }

    .step-content {
      padding: 1.5rem 2rem 2rem;
    }

    .step-header h1 {
      font-size: 1.75rem;
    }

    .name-fields {
      grid-template-columns: 1fr;
    }

    .bundesland-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }

    .step-dots {
      padding: 1.5rem 1rem 1rem;
      gap: 0.75rem;
    }

    .step-dot {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .nav-btn {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .step-content {
      padding: 1rem 1.5rem 1.5rem;
    }

    .bundesland-grid {
      grid-template-columns: 1fr 1fr;
    }

    .subject-chips {
      gap: 0.5rem;
    }

    .subject-chip {
      padding: 0.625rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>
