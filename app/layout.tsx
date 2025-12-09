// file: project/app/layout.tsx
// Author: Lucas Lotze (llotze@bu.edu), 12/01/2025
// Description: Root layout for the application.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardDataProvider } from "@/hooks/DashboardDataContext";
import { ClientNav } from "@/components/ClientNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Budgeting App",
  description: "CS412 | Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardDataProvider>
          <div className="min-h-screen bg-background text-foreground p-6">
            <ClientNav />
            {children}
          </div>
        </DashboardDataProvider>
      </body>
    </html>
  );
}
