/**
 * Shiny VIP badge — small gold pill with a moving highlight that sweeps
 * across every few seconds. Used next to the user avatar in the nav (and
 * anywhere else the account is surfaced).
 *
 * The shine effect is a pseudo-element with a translucent diagonal
 * highlight, animated via @keyframes vip-shine defined in globals.css.
 * Cosmetic only — no role-based gating yet.
 */
export function VipBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const padding = size === "md" ? "px-2.5 py-1" : "px-2 py-0.5";
  const text = size === "md" ? "text-[11px]" : "text-[10px]";
  return (
    <span
      className={`vip-shine relative inline-flex items-center gap-1 overflow-hidden rounded-full font-bold uppercase tracking-[0.18em] ${padding} ${text}`}
      style={{
        background:
          "linear-gradient(120deg, #f7d967 0%, #d4a017 45%, #f7d967 100%)",
        color: "#3a2a05",
        border: "1px solid rgba(212,160,23,0.55)",
        boxShadow:
          "0 2px 8px -2px rgba(212,160,23,0.55), inset 0 1px 0 rgba(255,255,255,0.55)",
        textShadow: "0 1px 0 rgba(255,255,255,0.35)",
      }}
      aria-label="VIP"
      title="VIP"
    >
      <svg
        width={size === "md" ? 11 : 10}
        height={size === "md" ? 11 : 10}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.18 21 12 16.27 5.82 21l2.36-7.15L2 9.36h7.61z" />
      </svg>
      VIP
    </span>
  );
}
