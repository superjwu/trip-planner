import type { Metadata } from "next";
import { MaybeClerkProvider } from "@/components/providers/MaybeClerkProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trip Planner — find your next 3-5 day getaway",
  description:
    "A trip planning copilot that turns vague preferences into curated destination options, itinerary previews, and booking links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MaybeClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-[var(--paper)] text-[var(--ink)]">
          {children}
        </body>
      </html>
    </MaybeClerkProvider>
  );
}
