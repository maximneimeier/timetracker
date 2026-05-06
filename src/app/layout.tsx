import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./lib/theme";
import { AuthProvider } from "./lib/AuthContext";
import { I18nProvider } from "./components/I18nProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-linear",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-linear",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Time Tracker",
  description:
    "Zeiterfassung mit Supabase-Login: Projekte, Timer und Auswertungen – jede Person eigene Daten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="dark">
      <body
        className={`${inter.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
