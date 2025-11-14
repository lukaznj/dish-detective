import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeRegistry from "@/components/ThemeRegistry";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Dish Detective",
  description: "Live student canteen food information",
  appleWebApp: {
    title: "Dish",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="hr">
        <body suppressHydrationWarning={true}>
          <ThemeRegistry>
            <Header />
            {children}
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
