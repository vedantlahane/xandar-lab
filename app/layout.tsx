import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xandar-Lab | Calm workspace for developers",
  description:
    "Monochrome landing with an attempt-first lab. Practice live now; notes, docs, and experiments coming next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
