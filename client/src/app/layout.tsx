import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CookiesProvider } from "next-client-cookies/server";

export const metadata: Metadata = {
  title: "Trivyl",
  description: "A quizzing and guessing game.",
};

const firacode = Montserrat({ subsets: ["latin"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("dark bg-background", firacode.className)}>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
