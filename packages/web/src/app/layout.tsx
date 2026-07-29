import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { SettingsProvider } from "@/lib/settings";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pet Shop Ops",
  description: "Consultations, records, and sales for your pet shop.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <SettingsProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
