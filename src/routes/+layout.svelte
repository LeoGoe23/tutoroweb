<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="navbar">
	<div class="nav-container">
		<a href="/" class="nav-brand">TutorWeb</a>
		<div class="nav-links">
			<a href="/" class:active={$page.url.pathname === '/'}>Home</a>
			<a href="/users" class:active={$page.url.pathname === '/users'}>Users</a>
		</div>
	</div>
</nav>

<main>
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f8f9fa;
	}
	
	:global(*) {
		box-sizing: border-box;
	}
	
	.navbar {
		background: white;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
		height: 60px;
	}
	
	.nav-brand {
		font-size: 1.5rem;
		font-weight: 700;
		color: #667eea;
		text-decoration: none;
	}
	
	.nav-links {
		display: flex;
		gap: 2rem;
	}
	
	.nav-links a {
		text-decoration: none;
		color: #666;
		font-weight: 500;
		transition: color 0.3s ease;
		padding: 0.5rem 1rem;
		border-radius: 4px;
	}
	
	.nav-links a:hover,
	.nav-links a.active {
		color: #667eea;
		background: rgba(102, 126, 234, 0.1);
	}
	
	main {
		min-height: calc(100vh - 60px);
	}
	
	@media (max-width: 768px) {
		.nav-container {
			padding: 0 1rem;
		}
		
		.nav-links {
			gap: 1rem;
		}
		
		.nav-links a {
			padding: 0.5rem;
			font-size: 0.9rem;
		}
	}
</style>
