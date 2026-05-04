"use client";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { setLocale } from "@/i18n/setLocale";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const [, startTransition] = useTransition();

  function handleSwitch(locale: Locale) {
    if (locale === currentLocale) return;
    startTransition(async () => {
      await setLocale(locale);
    });
  }

  return (
    <div className="flex items-center gap-0.5 mr-3">
      {LOCALES.map((locale) => {
        const active = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSwitch(locale)}
            className="rounded-full px-2.5 py-1 text-xs font-semibold transition"
            style={
              active
                ? {
                    backgroundColor: "var(--accent)",
                    color: "#ffffff",
                    border: "1px solid var(--accent)",
                    fontFamily: "var(--font-body-stack)",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "var(--ink-soft)",
                    border: "1px solid var(--hairline)",
                    fontFamily: "var(--font-body-stack)",
                    cursor: "pointer",
                  }
            }
          >
            {LOCALE_LABELS[locale]}
          </button>
        );
      })}
    </div>
  );
}
