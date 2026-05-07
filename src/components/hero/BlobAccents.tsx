/**
 * Decorative SVG accents lifted from `gallery/v54d-coastal-slate/page.tsx`.
 * Used by the landing hero to give the page editorial flavor without leaning
 * on stock photography. Pure presentation — no props, no state, no a11y
 * surface (everything is `aria-hidden`).
 */

export function BlobTerracotta({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "pointer-events-none absolute right-[-80px] top-[-40px] w-[520px]"}
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M380 55 C450 100 490 185 470 280 C450 375 350 430 250 410 C150 390 70 310 85 210 C100 110 190 35 290 25 C335 18 355 35 380 55Z"
        fill="#2C5474"
        opacity="0.12"
      />
    </svg>
  );
}

export function BlobSunYellow({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "pointer-events-none absolute bottom-[-60px] left-[-80px] w-[420px]"}
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M70 340 C25 295 -15 205 18 130 C52 55 145 18 225 42 C305 65 355 158 330 245 C305 332 215 385 145 375 C112 370 90 362 70 340Z"
        fill="#E76F51"
        opacity="0.10"
      />
    </svg>
  );
}

export function LeafDot({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "inline-block h-1.5 w-1.5 rounded-full bg-[#2C5474]"}
      aria-hidden="true"
    />
  );
}

export function FloatingAccentDot({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "absolute h-4 w-4 rounded-full bg-[#E76F51]"}
      aria-hidden="true"
    />
  );
}
