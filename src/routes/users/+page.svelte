<script lang="ts">
  // This page is now deprecated since user management is handled through Firebase
  // Consider redirecting to dashboard or removing this route

  let message = "Die Benutzerverwaltung wird jetzt über Firebase Authentication und Firestore abgewickelt.";
</script>

<svelte:head>
  <title>Benutzer - Tutoro</title>
</svelte:head>

<div class="container">
  <h1>Benutzerverwaltung</h1>
  <p>{message}</p>
  <p>
    <a href="/dashboard">Zum Dashboard</a> |
    <a href="/auth">Anmeldung</a>
  </p>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    color: white;
  }

  h1 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }

  a {
    color: #fbbf24;
    text-decoration: none;
    margin: 0 0.75rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
    transition: all 0.3s ease;
    display: inline-block;
  }

  a:hover {
    background: rgba(251, 191, 36, 0.2);
    border-color: #fbbf24;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    text-decoration: none;
  }
</style>
