import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MainNav } from "@/components/nav/MainNav";
import {
  BlobTerracotta,
  BlobSunYellow,
  LeafDot,
  FloatingAccentDot,
} from "@/components/hero/BlobAccents";
import { ENRICHED_DESTINATIONS as DESTINATIONS } from "@/lib/seed/enrich-destinations";
import { destinationPhotoUrl } from "@/lib/photo";

const STEP_SLUGS = ["big-sur-ca", "yellowstone-np", "charleston-sc"] as const;

export default async function Home() {
  const t = await getTranslations("landing");

  const stepDests = STEP_SLUGS.map((slug) => {
    const d = DESTINATIONS.find((x) => x.slug === slug);
    if (!d) throw new Error(`landing: missing seed destination ${slug}`);
    return d;
  });

  return (
    <>
      <MainNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--paper)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 480px at 75% 25%, rgba(44,84,116,0.10), transparent 70%), radial-gradient(700px 420px at 12% 85%, rgba(231,111,81,0.08), transparent 70%)",
          }}
        />
        <BlobTerracotta />
        <BlobSunYellow />

        <div className="relative mx-auto w-full max-w-5xl px-6 py-28 md:py-40">
          <p
            className="mb-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
          >
            <LeafDot />
            <span>{t("kicker")}</span>
            <LeafDot />
          </p>

          <h1
            className="font-light leading-[1.02] tracking-[-0.02em] text-[3.2rem] sm:text-7xl md:text-8xl"
            style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
          >
            {t.rich("headline", {
              em: (chunks) => (
                <em style={{ fontStyle: "italic", color: "var(--slate-primary)" }}>{chunks}</em>
              ),
            })}
          </h1>

          <p
            className="mt-8 max-w-xl text-lg italic md:text-xl"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            {t("dek")}
          </p>

          <div className="mt-10 flex flex-col items-start gap-3">
            <Link
              href="/plan"
              className="btn-accent inline-block px-10 py-4 text-base"
              style={{ fontFamily: "var(--font-body-stack)" }}
            >
              {t("ctaPrimary")} →
            </Link>
            <p
              className="text-xs italic"
              style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink-soft)" }}
            >
              {t.rich("ctaSecondary", {
                link: (chunks) => (
                  <Link
                    href="/trips/demo"
                    className="underline hover:opacity-70"
                    style={{ color: "var(--slate-primary)" }}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works — alternating editorial blocks ─────────────── */}
      <section
        className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
        style={{ background: "var(--paper)" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="mb-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--slate-primary)" }}
          >
            <LeafDot />
            <span>{t("howKicker")}</span>
            <LeafDot />
          </p>
          <h2
            className="text-4xl font-light leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
          >
            {t.rich("howHeadline", {
              em: (chunks) => <em style={{ fontStyle: "italic" }}>{chunks}</em>,
            })}
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-24 md:gap-32">
          <Step
            n="01"
            stepLabel={t("step1Label")}
            title={t.rich("step1Title", {
              em: (chunks) => <em style={{ fontStyle: "italic" }}>{chunks}</em>,
            })}
            body={t("step1Body")}
            destination={stepDests[0]}
            imageOnRight={false}
          />
          <Step
            n="02"
            stepLabel={t("step2Label")}
            title={t.rich("step2Title", {
              em: (chunks) => <em style={{ fontStyle: "italic" }}>{chunks}</em>,
            })}
            body={t("step2Body")}
            destination={stepDests[1]}
            imageOnRight={true}
          />
          <Step
            n="03"
            stepLabel={t("step3Label")}
            title={t.rich("step3Title", {
              em: (chunks) => <em style={{ fontStyle: "italic" }}>{chunks}</em>,
            })}
            body={t("step3Body")}
            destination={stepDests[2]}
            imageOnRight={false}
          />
        </div>
      </section>

      {/* ── Closing CTA strip ─────────────────────────────────────────── */}
      <section
        className="relative mx-auto w-full px-6 py-24 md:py-28"
        style={{ background: "var(--paper-deep)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--slate-primary) 30%, var(--accent) 70%, transparent)",
          }}
        />
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-2xl italic md:text-3xl"
            style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
          >
            {t("closingLine")}
          </p>
          <div className="mt-8">
            <Link
              href="/plan"
              className="btn-accent inline-block px-10 py-4 text-base"
              style={{ fontFamily: "var(--font-body-stack)" }}
            >
              {t("ctaPrimary")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

interface StepDest {
  slug: string;
  name: string;
  state: string;
  heroPhotoUrl?: string;
}

function Step({
  n,
  stepLabel,
  title,
  body,
  destination,
  imageOnRight,
}: {
  n: string;
  stepLabel: string;
  title: React.ReactNode;
  body: string;
  destination: StepDest;
  imageOnRight: boolean;
}) {
  const photo = destinationPhotoUrl(destination);
  const imageCol = (
    <div className="relative">
      <FloatingAccentDot
        className={
          imageOnRight
            ? "absolute -left-3 top-6 h-5 w-5 rounded-full"
            : "absolute -right-3 bottom-6 h-5 w-5 rounded-full"
        }
      />
      <div
        className="overflow-hidden"
        style={{
          aspectRatio: "4 / 5",
          borderRadius: "2rem",
          boxShadow: "0 30px 60px -25px rgba(31,41,55,0.20)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={destination.name}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <p
        className="mt-3 text-xs italic"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {destination.name} · {destination.state}
      </p>
    </div>
  );
  const contentCol = (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <p
          className="text-6xl font-light italic md:text-7xl"
          style={{ fontFamily: "var(--font-display-stack)", color: "var(--slate-primary)" }}
        >
          {n}
        </p>
        <span className="inline-flex items-center gap-2">
          <LeafDot />
          <span
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
          >
            {stepLabel}
          </span>
        </span>
      </div>
      <h3
        className="mt-4 text-3xl font-light leading-snug md:text-4xl"
        style={{ fontFamily: "var(--font-display-stack)", color: "var(--ink)" }}
      >
        {title}
      </h3>
      <p
        className="mt-5 max-w-md text-base leading-relaxed"
        style={{ fontFamily: "var(--font-body-stack)", color: "var(--ink-soft)" }}
      >
        {body}
      </p>
    </div>
  );

  return (
    <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
      <div className={imageOnRight ? "md:order-2 md:col-span-5" : "md:col-span-5"}>
        {imageCol}
      </div>
      <div
        className={
          imageOnRight
            ? "md:order-1 md:col-span-7 md:pr-8"
            : "md:col-span-7 md:pl-8"
        }
      >
        {contentCol}
      </div>
    </div>
  );
}
