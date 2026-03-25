import type { Metadata } from "next";
import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "CV Hub Pro",
  description: "Build ATS-friendly resumes in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
