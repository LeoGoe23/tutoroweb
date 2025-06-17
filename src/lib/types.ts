import type { User as FirebaseUser } from "firebase/auth";

// Firebase auth types
export type AuthUser = FirebaseUser;

export interface AuthError {
  code: string;
  message: string;
}
