import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { MaybeClerkProvider } from "@/components/providers/MaybeClerkProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Trip Planner — find your next 3-5 day getaway",
  description:
    "A trip planning copilot that turns vague preferences into curated destination options, itinerary previews, and booking links.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <MaybeClerkProvider>
      <html
        lang={locale}
        className={`${dmSans.variable} ${manrope.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[var(--paper)] text-[var(--ink)]">
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </MaybeClerkProvider>
  );
}
