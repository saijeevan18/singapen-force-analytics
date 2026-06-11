import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SingaPen Force Analytics (SFA) — Safety Command Center",
  description: "Enterprise-grade Safety & Incident Management Command Center UI prototype. Real-time operations feeds, Tamil Nadu regional hazard heatmap, and dispatch analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 animate-fade-in">
        {children}
      </body>
    </html>
  );
}
