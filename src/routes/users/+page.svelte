<script lang="ts">
  // This page is now deprecated since user management is handled through Firebase
  // Consider redirecting to dashboard or removing this route

  let message = "User management is now handled through Firebase Authentication and Firestore.";
</script>

<svelte:head>
  <title>Users - Tutoro</title>
</svelte:head>

<div class="container">
  <h1>User Management</h1>
  <p>{message}</p>
  <p>
    <a href="/dashboard">Go to Dashboard</a> |
    <a href="/auth">Authentication</a>
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
