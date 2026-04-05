import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Harold & Crew — Regain Your Rhythm",
  description: "A companion who helps you understand your patterns, connect with your community, and restore balance to your life.",
  icons: {
    icon: "/Attune_Logo_White_png.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
