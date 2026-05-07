import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavUserSlot } from "./NavUserSlot";
import { isClerkConfigured } from "@/lib/clerk-config";

export async function MainNav() {
  const t = await getTranslations("nav");
  const showUser = isClerkConfigured();

  return (
    <header
      className="sticky top-0 z-50 flex items-center border-b border-[var(--hairline)] bg-[var(--paper-deep)]/90 px-6 backdrop-blur-md"
      style={{ height: "var(--nav-h)" }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        className="flex-1 text-lg text-[var(--ink)] select-none"
        style={{ fontFamily: "var(--font-display-stack)", fontWeight: 500 }}
      >
        <em style={{ color: "var(--slate-primary)" }}>Trip</em>{" "}
        <span>Planner</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 text-sm mr-3">
        {(
          [
            { href: "/trips", label: t("myTrips") },
            { href: "/destinations", label: t("browse") },
            { href: "/settings", label: t("settings") },
          ] as const
        ).map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="group relative px-4 py-1.5 text-[var(--ink-soft)] transition-colors hover:text-[var(--slate-primary)]"
            style={{ fontFamily: "var(--font-body-stack)" }}
          >
            {label}
            {/* coral underline on hover */}
            <span
              className="absolute bottom-0 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-x-100"
              aria-hidden="true"
            />
          </Link>
        ))}
      </nav>

      {/* Locale switcher */}
      <LocaleSwitcher />

      {/* Primary CTA */}
      <Link href="/plan" className="btn-accent px-5 py-2 text-sm font-semibold">
        {t("newTrip")}
      </Link>

      {/* Account avatar (Clerk) — sign-out + manage-account dropdown */}
      {showUser && <NavUserSlot signInLabel={t("signIn")} />}
    </header>
  );
}
