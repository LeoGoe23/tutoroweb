<script lang="ts">
	import type { User } from '$lib/types';
	
	export let data: { users: User[] };
	
	let newUserName = '';
	let newUserEmail = '';
	
	async function addUser() {
		if (!newUserName || !newUserEmail) return;
		
		const response = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: newUserName,
				email: newUserEmail
			})
		});
		
		if (response.ok) {
			// Refresh the page to show the new user
			location.reload();
		}
	}
</script>

<svelte:head>
	<title>Users - TutorWeb</title>
</svelte:head>

<div class="container">
	<h1>Users</h1>
	
	<div class="user-list">
		{#each data.users as user}
			<div class="user-card">
				<h3>{user.name}</h3>
				<p>{user.email}</p>
			</div>
		{/each}
	</div>
	
	<div class="add-user">
		<h2>Add New User</h2>
		<form on:submit|preventDefault={addUser}>
			<input 
				type="text" 
				placeholder="Name" 
				bind:value={newUserName}
				required
			/>
			<input 
				type="email" 
				placeholder="Email" 
				bind:value={newUserEmail}
				required
			/>
			<button type="submit">Add User</button>
		</form>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	h1 {
		color: #333;
		margin-bottom: 2rem;
	}
	
	.user-list {
		display: grid;
		gap: 1rem;
		margin-bottom: 3rem;
	}
	
	.user-card {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 8px;
		border-left: 4px solid #007bff;
	}
	
	.user-card h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}
	
	.user-card p {
		margin: 0;
		color: #666;
	}
	
	.add-user {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	}
	
	.add-user h2 {
		margin-top: 0;
		color: #333;
	}
	
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	input {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}
	
	button {
		background: #007bff;
		color: white;
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}
	
	button:hover {
		background: #0056b3;
	}
</style>
