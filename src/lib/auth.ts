import { writable, type Readable } from 'svelte/store';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { browser } from '$app/environment';

// User store
export const user = writable<User | null>(null);

// Loading state
export const loading = writable(true);

// Auth error store
export const authError = writable<string>('');

// Initialize auth state listener
if (browser) {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.set(firebaseUser);
    loading.set(false);
  });
}

// Auth functions
export const authStore = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      authError.set('');
      loading.set(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error: any) {
      authError.set(error.message);
      throw error;
    } finally {
      loading.set(false);
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      authError.set('');
      loading.set(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error: any) {
      authError.set(error.message);
      throw error;
    } finally {
      loading.set(false);
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      authError.set('');
    } catch (error: any) {
      authError.set(error.message);
      throw error;
    }
  },

  // Clear auth error
  clearError: () => {
    authError.set('');
  }
};
