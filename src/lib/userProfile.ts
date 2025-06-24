import { doc, setDoc, getDoc, updateDoc, serverTimestamp, type DocumentReference } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";
import type { UserSubscription, Jahrgangsstufe, Bundesland, KursFach } from "./types";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
  
  // Profile completion status
  profileCompleted: boolean;
  
  // School information
  jahrgangsstufe?: Jahrgangsstufe;
  bundesland?: Bundesland;
  kursFach?: KursFach[];
  
  subscription?: UserSubscription;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  stats?: {
    totalSessions: number;
    weeklyProgress: number;
    streakDays: number;
    completedLessons: number;
  };
  subjects?: string[];
  tutorInfo?: {
    isTutor: boolean;
    specializations?: string[];
    hourlyRate?: number;
    rating?: number;
    totalStudents?: number;
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
      const firstName = additionalData.firstName || displayName?.split(" ")[0] || "";
      const lastName = additionalData.lastName || displayName?.split(" ").slice(1).join(" ") || "";      const userData: UserProfile = {
        uid: user.uid,
        email: email || "",
        displayName: displayName || `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        photoURL: photoURL || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileCompleted: false,
        subscription: {
          tier: 'free',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        preferences: {
          language: "de",
          theme: "light",
          notifications: true,
        },
        stats: {
          totalSessions: 0,
          weeklyProgress: 0,
          streakDays: 0,
          completedLessons: 0,
        },
        subjects: [],
        tutorInfo: {
          isTutor: false,
        },
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

  // Update user stats
  updateUserStats: async (uid: string, stats: Partial<UserProfile["stats"]>) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        stats: stats,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw error;
    }
  },

  // Update user preferences
  updateUserPreferences: async (uid: string, preferences: Partial<UserProfile["preferences"]>) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        preferences: preferences,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user preferences:", error);
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
  },
  
  // Complete user profile with school information
  completeUserProfile: async (
    uid: string, 
    schoolInfo: {
      jahrgangsstufe: Jahrgangsstufe;
      bundesland: Bundesland;
      kursFach: KursFach[];
    }
  ) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        jahrgangsstufe: schoolInfo.jahrgangsstufe,
        bundesland: schoolInfo.bundesland,
        kursFach: schoolInfo.kursFach,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });
      
      // Return the updated profile
      return await userProfileService.getUserProfile(uid);
    } catch (error) {
      console.error("Error completing user profile:", error);
      throw error;
    }
  },
};
