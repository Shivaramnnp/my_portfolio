import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { AiChatFab } from "@/components/public/ai-chat-fab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase.from('profiles').select('os_name, full_name, title').limit(1).single()
    if (profile) {
      const osName = profile.os_name || "ShivaOS"
      const fullName = profile.full_name || "Shivaram Nunugonda"
      const title = profile.title || "Developer OS"
      return {
        title: `${osName} | Developer OS`,
        description: `Personal Developer Operating System of ${fullName}. ${title}`,
      }
    }
  } catch (e) {
    console.error("Error generating metadata in layout:", e)
  }
  return {
    title: "ShivaOS | Developer OS",
    description: "Personal Developer Operating System of Shivaram Nunugonda.",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="cyberpunk"
          enableSystem={false}
          themes={["light", "dark", "cyberpunk"]}
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <AiChatFab />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
