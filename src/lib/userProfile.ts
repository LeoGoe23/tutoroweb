import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";
import type { UserSubscription, Jahrgangsstufe, Bundesland, KursFach, SchulArt } from "./types";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;

  // Profile completion status
  profileCompleted: boolean;
  // School information
  jahrgangsstufe?: Jahrgangsstufe;
  bundesland?: Bundesland;
  schulArt?: SchulArt;
  kursFach?: KursFach[];
  learningGoals?: string;

  subscription?: UserSubscription;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

export const userProfileService = {
  // Create user profile in Firestore
  createUserProfile: async (user: User, additionalData: Partial<UserProfile> = {}) => {
    if (!user) return null;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const firstName = additionalData.firstName ?? displayName?.split(" ")[0] ?? "";
      const lastName = additionalData.lastName ?? displayName?.split(" ").slice(1).join(" ") ?? "";
      const userData: UserProfile = {
        uid: user.uid,
        email: email ?? "",
        displayName: displayName ?? firstName + (lastName ? ` ${lastName}` : ""),
        firstName,
        lastName: lastName || undefined,
        photoURL: photoURL ?? undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileCompleted: false,
        subscription: {
          tier: "free",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        preferences: {
          language: "de",
          theme: "light",
          notifications: true,
        },
        // entfernt: stats, subjects, tutorInfo
        ...additionalData,
      };

      try {
        await setDoc(userRef, userData);
        return userData;
      } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
    }

    return userDoc.data() as UserProfile;
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, updates: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Update user subscription
  updateUserSubscription: async (uid: string, subscription: Partial<UserSubscription>) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        subscription: {
          ...subscription,
          updatedAt: new Date(),
        },
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user subscription:", error);
      throw error;
    }
  }, // Complete user profile with school information
  completeUserProfile: async (
    uid: string,
    profileData: {
      firstName?: string;
      lastName?: string;
      jahrgangsstufe: Jahrgangsstufe;
      bundesland: Bundesland;
      schulArt: SchulArt;
      kursFach: KursFach[];
      learningGoals?: string;
    }
  ) => {
    try {
      const userRef = doc(db, "users", uid);
      const updateData: any = {
        jahrgangsstufe: profileData.jahrgangsstufe,
        bundesland: profileData.bundesland,
        schulArt: profileData.schulArt,
        kursFach: profileData.kursFach,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      };

      // Add optional fields if provided
      if (profileData.firstName) {
        updateData.firstName = profileData.firstName;
      }
      if (profileData.lastName) {
        updateData.lastName = profileData.lastName;
      }
      if (profileData.learningGoals) {
        updateData.learningGoals = profileData.learningGoals;
      }

      await updateDoc(userRef, updateData);

      // Return the updated profile
      return await userProfileService.getUserProfile(uid);
    } catch (error) {
      console.error("Error completing user profile:", error);
      throw error;
    }
  },
};
