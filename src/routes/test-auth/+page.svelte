<script lang="ts">
  import { onMount } from "svelte";
  import { authStore, user, loading, authError } from "$lib/auth";

  let testEmail = "test@example.com";
  let testPassword = "testpassword123";
  let testResults: string[] = [];

  function addResult(message: string) {
    testResults = [...testResults, `${new Date().toLocaleTimeString()}: ${message}`];
  }
  async function runAuthTests() {
    testResults = [];
    addResult("Starting authentication tests...");

    try {
      // Test 1: Sign up
      addResult("Testing sign up...");
      await authStore.signUp(testEmail, testPassword);
      addResult("✅ Sign up successful");

      // Test 2: Sign out
      addResult("Testing sign out...");
      await authStore.signOut();
      addResult("✅ Sign out successful");

      // Test 3: Sign in
      addResult("Testing sign in...");
      await authStore.signIn(testEmail, testPassword);
      addResult("✅ Sign in successful");

      addResult("🎉 All tests passed!");
    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
    }
  }

  async function testGoogleSignIn() {
    testResults = [];
    addResult("Testing Google Sign-In...");

    try {
      await authStore.signInWithGoogle();
      addResult("✅ Google sign-in successful");
    } catch (error: any) {
      addResult(`❌ Google sign-in failed: ${error.message}`);
    }
  }

  function clearResults() {
    testResults = [];
  }
</script>

<svelte:head>
  <title>Firebase Auth Test - Tutoro</title>
</svelte:head>

<div class="test-container">
  <div class="test-card">
    <h1>Firebase Authentication Test</h1>
    <p>This page helps you test if Firebase authentication is working correctly.</p>

    <div class="current-state">
      <h3>Current Auth State:</h3>
      {#if $loading}
        <p class="status loading">Loading...</p>
      {:else if $user}
        <p class="status authenticated">✅ Authenticated as: {$user.email}</p>
        <button on:click={() => authStore.signOut()} class="btn secondary">Sign Out</button>
      {:else}
        <p class="status unauthenticated">❌ Not authenticated</p>
      {/if}

      {#if $authError}
        <p class="error">Error: {$authError}</p>
      {/if}
    </div>

    <div class="test-section">
      <h3>Authentication Test:</h3>
      <div class="test-inputs">
        <input bind:value={testEmail} placeholder="Test email" type="email" />
        <input bind:value={testPassword} placeholder="Test password" type="password" />
      </div>
      <div class="test-actions">
        <button on:click={runAuthTests} class="btn primary">Run Email/Password Tests</button>
        <button on:click={testGoogleSignIn} class="btn google">Test Google Sign-In</button>
        <button on:click={clearResults} class="btn secondary">Clear Results</button>
      </div>

      {#if testResults.length > 0}
        <div class="test-results">
          <h4>Test Results:</h4>
          <div class="results-list">
            {#each testResults as result}
              <div class="result-item">{result}</div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="instructions">
      <h3>Setup Instructions:</h3>
      <ol>
        <li>Make sure you've set up your Firebase project</li>
        <li>Update the Firebase config in <code>src/lib/firebase.ts</code></li>
        <li>Enable Email/Password authentication in Firebase Console</li>
        <li>Click "Run Tests" above to test the authentication flow</li>
      </ol>
    </div>
  </div>
</div>

<style>
  .test-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .test-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .current-state,
  .test-section,
  .instructions {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .status {
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    margin: 0.5rem 0;
  }

  .status.loading {
    background: #eff6ff;
    color: #2563eb;
  }
  .status.authenticated {
    background: #f0fdf4;
    color: #16a34a;
  }
  .status.unauthenticated {
    background: #fef2f2;
    color: #dc2626;
  }

  .error {
    background: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 6px;
    margin: 0.5rem 0;
  }

  .test-inputs {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .test-inputs input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .test-actions {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
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

  .btn.primary:hover {
    background: #5338f1;
  }

  .btn.secondary {
    background: #f3f4f6;
    color: #374151;
  }
  .btn.secondary:hover {
    background: #e5e7eb;
  }

  .btn.google {
    background: #4285f4;
    color: white;
  }

  .btn.google:hover {
    background: #3367d6;
  }

  .test-results {
    margin-top: 1rem;
  }

  .results-list {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
  }

  .result-item {
    font-family: monospace;
    font-size: 0.8rem;
    margin: 0.25rem 0;
    padding: 0.25rem;
  }

  .instructions ol {
    margin: 1rem 0;
  }

  .instructions li {
    margin: 0.5rem 0;
  }

  .instructions code {
    background: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9rem;
  }
</style>
