import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <LanguageProvider>
            <ErrorBoundary>
              <Header />
              {children}
            </ErrorBoundary>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
