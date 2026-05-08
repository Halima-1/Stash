import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Stash",
  description: "Stablecoin protocol for saving, transferring, and compounding digital dollars.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="app-root">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
