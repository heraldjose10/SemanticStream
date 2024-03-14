import type { Metadata } from "next";

import "./globals.css";
import { inter, roboto_mono } from "./fonts";

export const metadata: Metadata = {
  title: "SemanticStream",
  description: "AI application created by Herald Olakkengil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col items-center py-4 sm:py-6 ${inter.className}`}
      >
        <header className="flex min-w-full px-6">
          <h1
            className={`text-xl ${roboto_mono.className} sm:text-3xl lg:text-4xl`}
          >
            SemanticStream
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
