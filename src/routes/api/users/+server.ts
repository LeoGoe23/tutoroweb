import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { User, CreateUserRequest } from '$lib/types';

// Sample user data (in a real app, this would come from a database)
const users: User[] = [
	{ id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
	{ id: 2, name: 'Bob Smith', email: 'bob@example.com' },
	{ id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];

// GET /api/users
export const GET: RequestHandler = async () => {
	return json(users);
};

// POST /api/users
export const POST: RequestHandler = async ({ request }) => {
	const newUser: CreateUserRequest = await request.json();
	const user: User = {
		id: users.length + 1,
		...newUser
	};
	users.push(user);
	return json(user, { status: 201 });
};
