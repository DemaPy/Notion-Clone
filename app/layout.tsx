import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/components/providers/convex-providers";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion clone",
  description: "Better workspace",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/logo.svg",
      href: "/logo.svg",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/logo-dark.svg",
      href: "/logo-dark.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexProvider>
          <Toaster position="bottom-center" />
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
