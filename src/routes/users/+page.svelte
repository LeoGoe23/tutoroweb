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
  }

  h1 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: #4f46e5;
    text-decoration: none;
    margin: 0 0.5rem;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
