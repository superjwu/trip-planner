export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "tp-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  zh: "中",
};
