import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { AuthModal } from "@/components/ui/AuthModal";
import { SubmitModal } from "@/components/ui/SubmitModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GraphOne — The AI Economy Intelligence Layer",
  description: "Discover AI companies, investors, products, funding rounds, and jobs. The intelligence graph for the AI economy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProvider>
          {children}
          <SearchOverlay />
          <AuthModal />
          <SubmitModal />
        </AppProvider>
      </body>
    </html>
  );
}
