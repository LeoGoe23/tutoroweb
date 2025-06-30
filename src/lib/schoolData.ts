// Zentrale Daten für Schulprofile

export const BUNDESLAENDER = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen"
] as const;

export const JAHRGANGSSTUFEN = [
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "Studium",
  "Erwachsenenbildung"
] as const;

export const SCHULARTEN = [
  "Grundschule",
  "Hauptschule",
  "Realschule",
  "Gesamtschule",
  "Gymnasium",
  "Berufsschule",
  "Berufsoberschule",
  "Fachoberschule",
  "Fachhochschule",
  "Universität",
  "Privatschule",
  "Waldorfschule",
  "Montessori-Schule",
  "Internationale Schule",
  "Sonstiges"
] as const;

export const SUBJECT_CATEGORIES = {
  Sprachen: ["Deutsch", "Englisch", "Französisch", "Spanisch", "Latein"],
  MINT: ["Mathematik", "Physik", "Chemie", "Biologie", "Informatik"],
  Gesellschaft: ["Geschichte", "Erdkunde", "Politik", "Wirtschaft", "Religion", "Ethik", "Philosophie"],
  "Kreativ & Sport": ["Kunst", "Musik", "Sport"],
  Weitere: ["Psychologie", "Pädagogik", "Sonstiges"],
} as const;

// Für flache Liste aller Fächer (z.B. für Multi-Select)
export const INTERESSENSFAECHER = [
  ...SUBJECT_CATEGORIES.Sprachen,
  ...SUBJECT_CATEGORIES.MINT,
  ...SUBJECT_CATEGORIES.Gesellschaft,
  ...SUBJECT_CATEGORIES["Kreativ & Sport"],
  ...SUBJECT_CATEGORIES.Weitere
] as const;
