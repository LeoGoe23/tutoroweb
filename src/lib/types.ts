import type { User as FirebaseUser } from "firebase/auth";

// Firebase auth types
export type AuthUser = FirebaseUser;

export interface AuthError {
  code: string;
  message: string;
}

// Subscription types
export type SubscriptionTier = "free" | "plus" | "pro";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  stripePriceId?: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// German school system types
export type Jahrgangsstufe = "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "Studium" | "Erwachsenenbildung";

export type Bundesland =
  | "Baden-Württemberg"
  | "Bayern"
  | "Berlin"
  | "Brandenburg"
  | "Bremen"
  | "Hamburg"
  | "Hessen"
  | "Mecklenburg-Vorpommern"
  | "Niedersachsen"
  | "Nordrhein-Westfalen"
  | "Rheinland-Pfalz"
  | "Saarland"
  | "Sachsen"
  | "Sachsen-Anhalt"
  | "Schleswig-Holstein"
  | "Thüringen";

export type KursFach =
  | "Mathematik"
  | "Deutsch"
  | "Englisch"
  | "Französisch"
  | "Spanisch"
  | "Latein"
  | "Physik"
  | "Chemie"
  | "Biologie"
  | "Erdkunde"
  | "Geschichte"
  | "Politik"
  | "Wirtschaft"
  | "Religion"
  | "Ethik"
  | "Kunst"
  | "Musik"
  | "Sport"
  | "Informatik"
  | "Philosophie"
  | "Psychologie"
  | "Pädagogik"
  | "Sonstiges";

export type SchulArt =
  | "Grundschule"
  | "Hauptschule"
  | "Realschule"
  | "Gesamtschule"
  | "Gymnasium"
  | "Berufsschule"
  | "Berufsoberschule"
  | "Fachoberschule"
  | "Fachhochschule"
  | "Universität"
  | "Privatschule"
  | "Waldorfschule"
  | "Montessori-Schule"
  | "Internationale Schule"
  | "Sonstiges";
