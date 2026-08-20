import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopC | ERP SaaS",
  description: "LoopC ERP — business software for growing companies.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
