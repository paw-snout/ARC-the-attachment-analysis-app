import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AssessmentProvider } from "./context/AssessmentContext";
import { ChatAnalysisProvider } from "./context/ChatAnalysisContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arc - Behavioral Analytics",
  description: "A private space to understand your attachment patterns through simple, consistent observation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-inter antialiased"
      >
        <ChatAnalysisProvider>
          <AssessmentProvider>{children}</AssessmentProvider>
        </ChatAnalysisProvider>
      </body>
    </html>
  );
}
