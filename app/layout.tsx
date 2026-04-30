import type { Metadata } from "next";
import Script from "next/script";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Nav";
import { PageTransition } from "./providers";
import { MalloyShell } from "@/components/project/MalloyShell";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andrew Lau",
  description: "Business analytics and product thinking. USF '26.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <MalloyShell />
        <PageTransition>{children}</PageTransition>
              {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
