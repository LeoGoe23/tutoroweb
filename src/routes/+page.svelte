<svelte:head>
	<title>TutorWeb - Home</title>
</svelte:head>

<div class="hero">
	<div class="container">
		<div class="hero-content">
			<h1>Welcome to TutorWeb</h1>
			<p class="hero-subtitle">Your Full-Stack SvelteKit Application</p>
			<div class="features">
				<div class="feature">
					<h3>🚀 SvelteKit</h3>
					<p>Modern full-stack framework with TypeScript</p>
				</div>
				<div class="feature">
					<h3>⚡ Fast</h3>
					<p>Blazing fast development and runtime performance</p>
				</div>
				<div class="feature">
					<h3>🔧 Full-Stack</h3>
					<p>Frontend and backend in one application</p>
				</div>
			</div>
			<div class="actions">
				<a href="/users" class="btn primary">View Users</a>
				<a href="/api/users" class="btn secondary">API Endpoint</a>
			</div>
		</div>
	</div>
</div>

<style>
	.hero {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
	}
	
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		width: 100%;
	}
	
	.hero-content {
		text-align: center;
	}
	
	h1 {
		font-size: 3.5rem;
		margin-bottom: 1rem;
		font-weight: 700;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
	}
	
	.hero-subtitle {
		font-size: 1.5rem;
		margin-bottom: 3rem;
		opacity: 0.9;
	}
	
	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}
	
	.feature {
		background: rgba(255, 255, 255, 0.1);
		padding: 2rem;
		border-radius: 12px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.feature h3 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
	}
	
	.feature p {
		margin: 0;
		opacity: 0.9;
	}
	
	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	
	.btn {
		display: inline-block;
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	
	.btn.primary {
		background: white;
		color: #667eea;
	}
	
	.btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0,0,0,0.2);
	}
	
	.btn.secondary {
		background: transparent;
		color: white;
		border: 2px solid white;
	}
	
	.btn.secondary:hover {
		background: white;
		color: #667eea;
	}
	
	@media (max-width: 768px) {
		h1 {
			font-size: 2.5rem;
		}
		
		.hero-subtitle {
			font-size: 1.2rem;
		}
		
		.features {
			grid-template-columns: 1fr;
		}
		
		.actions {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
