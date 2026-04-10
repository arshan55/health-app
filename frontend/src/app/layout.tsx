import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriGuide AI",
  description: "AI-powered personalized nutrition and habit building",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="navbar">
          <div className="nav-brand">NutriGuide AI</div>
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><Link href="/" className="nav-link">Dashboard</Link></li>
              <li><Link href="/log" className="nav-link">Log Food</Link></li>
              <li><Link href="/chat" className="nav-link">AI Assistant</Link></li>
              <li><Link href="/simulator" className="nav-link">Simulator</Link></li>
              <li style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </header>
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <footer style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          © 2026 NutriGuide Health
        </footer>
      </body>
    </html>
  );
}
