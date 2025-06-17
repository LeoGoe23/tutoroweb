import { writable, type Readable } from "svelte/store";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { browser } from "$app/environment";
import { userProfileService, type UserProfile } from "./userProfile";

// User store
export const user = writable<User | null>(null);

// User profile store
export const userProfile = writable<UserProfile | null>(null);

// Loading state
export const loading = writable(true);

// Auth error store
export const authError = writable<string>("");

// Initialize auth state listener
if (browser) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.set(firebaseUser);

    if (firebaseUser) {
      // Load user profile from Firestore
      try {
        const profile = await userProfileService.getUserProfile(firebaseUser.uid);
        userProfile.set(profile);
      } catch (error) {
        console.error("Error loading user profile:", error);
        userProfile.set(null);
      }
    } else {
      userProfile.set(null);
    }

    loading.set(false);
  });
}

// Auth functions
export const authStore = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      authError.set("");
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
  signUp: async (email: string, password: string, displayName?: string, firstName?: string, lastName?: string) => {
    try {
      authError.set("");
      loading.set(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName,
        });
      }

      // Create user profile in Firestore
      if (result.user) {
        await userProfileService.createUserProfile(result.user, {
          firstName: firstName || "",
          lastName: lastName || "",
          displayName: displayName || `${firstName} ${lastName}`.trim(),
        });
      }

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
      authError.set("");
    } catch (error: any) {
      authError.set(error.message);
      throw error;
    }
  },
  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      authError.set("");
      loading.set(true);
      const result = await signInWithPopup(auth, googleProvider);

      // Create or update user profile in Firestore for Google users
      if (result.user) {
        await userProfileService.createUserProfile(result.user);
      }

      return result;
    } catch (error: any) {
      authError.set(error.message);
      throw error;
    } finally {
      loading.set(false);
    }
  },

  // Clear auth error
  clearError: () => {
    authError.set("");
  },
};
