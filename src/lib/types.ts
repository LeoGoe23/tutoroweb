import type { User as FirebaseUser } from 'firebase/auth';

export interface User {
	id: number;
	name: string;
	email: string;
}

export interface CreateUserRequest {
	name: string;
	email: string;
}

// Firebase auth types
export type AuthUser = FirebaseUser;

export interface AuthError {
	code: string;
	message: string;
}
