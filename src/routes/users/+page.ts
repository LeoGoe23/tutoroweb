import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/users');
	const users = await response.json();
	
	return {
		users
	};
};
