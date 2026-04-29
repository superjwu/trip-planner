import Link from "next/link";
import { TRIP, PICKS, type GalleryPick, type GalleryTrip } from "../_mock";

// v22 — Lavender × Mustard / Funky Editorial Spread
// Palette: Lavender #B8A4D4 · Mustard #C99A2E · Charcoal #2A2A2E
//          Bone #EDE7DC · Plum-ink #3F2F4F
// Design language: Contemporary indie magazine — Apartamento / Real Review vibes.
// Chunky modern serifs, mono callouts, tilted headers, mustard marker-pen accents,
// pull quotes, numbered marginalia, lavender section bands.

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function LavenderMustardPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#EDE7DC", color: "#2A2A2E" }}
    >
      {/* Back link */}
      <div
        className="px-8 pt-8 pb-0"
        style={{ maxWidth: "960px", margin: "0 auto" }}
      >
        <Link
          href="/gallery"
          style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#2A2A2E",
            textDecoration: "none",
            fontVariant: "small-caps",
          }}
        >
          &larr;&nbsp;&nbsp;back to issue index
        </Link>
      </div>

      {/* Masthead */}
      <Masthead trip={TRIP} />

      {/* Picks */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px" }}>
        {PICKS.map((pick, i) => (
          <div key={pick.slug}>
            <PickEntry pick={pick} index={i} />
            {i < PICKS.length - 1 && <SectionDivider index={i} />}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#EDE7DC",
          borderTop: "3px solid #2A2A2E",
          marginTop: "80px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            backgroundColor: "#2A2A2E",
            color: "#C99A2E",
            padding: "6px 18px",
            display: "inline-block",
          }}
        >
          Mock Layout &middot; No Real Data Wired &middot; See Gallery Index
        </span>
      </footer>
    </main>
  );
}

function Masthead({ trip }: { trip: GalleryTrip }) {
  return (
    <header
      style={{
        backgroundColor: "#EDE7DC",
        borderTop: "3px solid #2A2A2E",
        borderBottom: "3px solid #2A2A2E",
        padding: "48px 32px 0",
        maxWidth: "960px",
        margin: "24px auto 0",
        overflow: "hidden",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#2A2A2E",
          fontVariant: "small-caps",
          marginBottom: "28px",
        }}
      >
        Trip Planner &middot; Issue 04 &middot; September 2026
      </p>

      {/* Display headline — rotated -2deg */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
            fontWeight: 600,
            fontSize: "clamp(42px, 7vw, 78px)",
            lineHeight: 1.05,
            color: "#2A2A2E",
            transform: "rotate(-2deg)",
            transformOrigin: "left center",
            display: "inline-block",
            maxWidth: "700px",
          }}
        >
          Where to dis&shy;appear
          <br />
          for four days
        </h1>
      </div>

      {/* Metadata strip */}
      <div
        style={{
          backgroundColor: "#2A2A2E",
          padding: "14px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 0",
          alignItems: "center",
          margin: "0 -32px",
        }}
      >
        {[
          `Departing ${trip.origin}`,
          formatDate(trip.departOn),
          `Return ${formatDate(trip.returnOn)}`,
          `${trip.tripLengthDays} nights`,
          trip.budgetBand,
          `${trip.pace} pace`,
          trip.vibes.join(" / "),
        ].map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#EDE7DC",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item}
            </span>
            {i < arr.length - 1 && (
              <span
                style={{
                  color: "#C99A2E",
                  margin: "0 14px",
                  fontSize: "12px",
                  lineHeight: 1,
                }}
              >
                &#9679;
              </span>
            )}
          </span>
        ))}
      </div>
    </header>
  );
}

function SectionDivider({ index }: { index: number }) {
  // Alternate between lavender band and mustard rule
  if (index % 2 === 0) {
    return (
      <div
        style={{
          backgroundColor: "#B8A4D4",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 -32px",
        }}
      >
        <span
          style={{
            color: "#C99A2E",
            fontSize: "48px",
            fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
            lineHeight: 1,
            opacity: 0.85,
          }}
        >
          &ldquo;
        </span>
      </div>
    );
  }
  return (
    <div
      style={{
        margin: "0 0",
        padding: "28px 0",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div style={{ flex: 1, height: "2px", backgroundColor: "#C99A2E" }} />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: "11px",
          color: "#C99A2E",
          letterSpacing: "0.2em",
        }}
      >
        &mdash; &sect; &mdash;
      </span>
      <div style={{ flex: 1, height: "2px", backgroundColor: "#C99A2E" }} />
    </div>
  );
}

function PickEntry({ pick, index }: { pick: GalleryPick; index: number }) {
  const entryNum = pad2(index + 1);
  const totalNum = pad2(PICKS.length);
  const isEven = index % 2 === 0;

  return (
    <article style={{ padding: "56px 0" }}>
      {/* Pagination chip */}
      <div
        style={{
          display: "flex",
          justifyContent: isEven ? "flex-start" : "flex-end",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#2A2A2E",
            border: "1.5px solid #2A2A2E",
            padding: "4px 10px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Entry {entryNum} / {totalNum}
        </span>
      </div>

      {/* Destination name + region */}
      <div style={{ marginBottom: "32px" }}>
        {/* Rotated marginalia number */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "72px",
              color: "#C99A2E",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              opacity: 0.35,
              flexShrink: 0,
              alignSelf: "center",
            }}
          >
            {String(pick.rank).padStart(2, "0")}
          </span>
          <div>
            <h2
              style={{
                fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                fontWeight: 600,
                fontSize: "clamp(40px, 6vw, 64px)",
                lineHeight: 1.0,
                color: "#2A2A2E",
                textDecoration: "underline",
                textDecorationColor: "#C99A2E",
                textDecorationThickness: "6px",
                textUnderlineOffset: "10px",
                marginBottom: "8px",
              }}
            >
              {pick.name}
            </h2>
            <p
              style={{
                fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                fontStyle: "italic",
                fontSize: "18px",
                color: "#2A2A2E",
                opacity: 0.7,
              }}
            >
              {pick.region}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout: photo + body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isEven ? "1.1fr 0.9fr" : "0.9fr 1.1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Photo column */}
        <div style={{ order: isEven ? 0 : 1 }}>
          {/* Hero photo */}
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pick.heroPhotoUrl}
              alt={`${pick.name} hero`}
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                display: "block",
                borderRadius: 0,
              }}
            />
            {/* Lavender caption ribbon */}
            <div
              style={{
                backgroundColor: "#B8A4D4",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transform: "rotate(0.5deg)",
                transformOrigin: "left bottom",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#2A2A2E",
                }}
              >
                Photograph &middot; Mock
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "#2A2A2E",
                  opacity: 0.6,
                }}
              >
                p.&nbsp;{pad2(index + 4)}
              </span>
            </div>
          </div>

          {/* Attractions: Points of Interest */}
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            {/* Rotated 90deg "POINTS OF INTEREST" label */}
            <div
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                transformOrigin: "center center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C99A2E",
                  fontWeight: 700,
                }}
              >
                Points of Interest
              </span>
            </div>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                flex: 1,
                borderLeft: "2px solid #B8A4D4",
                paddingLeft: "16px",
              }}
            >
              {pick.attractions.slice(0, 3).map((a, ai) => (
                <li
                  key={a.name}
                  style={{
                    marginBottom: ai < 2 ? "16px" : 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                      fontSize: "10px",
                      color: "#C99A2E",
                      fontVariantNumeric: "tabular-nums",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    {pad2(ai + 1)}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#2A2A2E",
                      margin: "0 0 2px",
                    }}
                  >
                    {a.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                      fontSize: "13px",
                      color: "#2A2A2E",
                      opacity: 0.65,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {a.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Body column */}
        <div style={{ order: isEven ? 1 : 0 }}>
          {/* Blurb */}
          <p
            style={{
              fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
              fontSize: "19px",
              lineHeight: 1.65,
              color: "#2A2A2E",
              marginBottom: "28px",
            }}
          >
            {pick.blurb}
          </p>

          {/* Pull quote from reasoning */}
          <blockquote
            style={{
              margin: "0 0 28px",
              padding: "0 0 0 24px",
              borderLeft: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                fontSize: "52px",
                color: "#C99A2E",
                lineHeight: 0.6,
                display: "block",
                marginBottom: "8px",
              }}
            >
              &ldquo;
            </span>
            <p
              style={{
                fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                fontStyle: "italic",
                fontSize: "21px",
                lineHeight: 1.5,
                color: "#3F2F4F",
                margin: "0 0 8px",
              }}
            >
              {pick.reasoning}
            </p>
            <span
              style={{
                fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                fontSize: "52px",
                color: "#C99A2E",
                lineHeight: 0.4,
                display: "block",
                textAlign: "right",
              }}
            >
              &rdquo;
            </span>
          </blockquote>

          {/* Match tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "28px",
            }}
          >
            {pick.matchTags.map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: "#B8A4D4",
                  color: "#2A2A2E",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  display: "inline-block",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Particulars table */}
          <div
            style={{
              border: "1.5px solid #2A2A2E",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2A2A2E",
                padding: "8px 14px",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C99A2E",
                }}
              >
                Particulars
              </span>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                {[
                  { label: "Flights", value: formatMoney(pick.cost.flightUsd) },
                  { label: "Lodging", value: formatMoney(pick.cost.lodgingUsd) },
                  { label: "Total Est.", value: formatMoney(pick.cost.totalUsd) },
                  { label: "High / Low", value: `${pick.weather.highF}° F / ${pick.weather.lowF}° F` },
                  { label: "Conditions", value: pick.weather.summary },
                ].map((row, ri) => (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: ri > 0 ? "1px solid #B8A4D4" : undefined,
                    }}
                  >
                    <td
                      style={{
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#C99A2E",
                        padding: "8px 14px",
                        width: "40%",
                        verticalAlign: "top",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                        fontSize: "11px",
                        color: "#2A2A2E",
                        padding: "8px 14px",
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "top",
                      }}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#C99A2E",
                color: "#2A2A2E",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "10px 22px",
                fontWeight: 700,
                cursor: "default",
              }}
            >
              File This Destination
            </span>
          </div>
        </div>
      </div>

      {/* Itinerary: 4 horizontal cards with lavender background */}
      <div style={{ marginTop: "40px" }}>
        {/* Section label rotated -3deg */}
        <div style={{ marginBottom: "20px" }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#2A2A2E",
              display: "inline-block",
              transform: "rotate(-3deg)",
              transformOrigin: "left center",
            }}
          >
            Day-by-Day
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${pick.itinerary.length}, 1fr)`,
            gap: "8px",
          }}
        >
          {pick.itinerary.map((day) => (
            <div
              key={day.day}
              style={{
                backgroundColor: "#B8A4D4",
                padding: "18px 16px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                  fontWeight: 600,
                  fontSize: "36px",
                  color: "#C99A2E",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  marginBottom: "10px",
                }}
              >
                {pad2(day.day)}
              </div>
              <p
                style={{
                  fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#2A2A2E",
                  marginBottom: "6px",
                  lineHeight: 1.2,
                }}
              >
                {day.title}
              </p>
              <p
                style={{
                  fontFamily: "'Spectral', 'Cormorant', Georgia, serif",
                  fontSize: "12px",
                  color: "#2A2A2E",
                  opacity: 0.75,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {day.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
