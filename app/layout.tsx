import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ui/theme-provider"

export const metadata: Metadata = {
  title: "Clickershive FreeLancer Dashboard",
  description: "Super FreeLancer Dashboard",
};

export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
