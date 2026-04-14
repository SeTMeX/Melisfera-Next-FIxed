import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/core/header/Navbar";
import { Footer } from "@/components/core/footer/Footer";
import I18nProvider from "@/components/providers/I18nProvider";
import { GlobalProviders } from "@/components/providers/GlobalProviders";

export const metadata: Metadata = {
  title: "Melisfera",
  description: "Produse naturale din miere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </div>
            <GlobalProviders />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
