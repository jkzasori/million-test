import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '../presentation/components/ErrorBoundary';
import FontLoader from '../components/FontLoader';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Million Test Properties',
  description: 'Discover your perfect property from our extensive collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html { visibility: hidden; opacity: 0; }
            html.fonts-loaded { visibility: visible; opacity: 1; transition: opacity 0.1s; }
          `
        }} />
      </head>
      <body className={inter.className}>
        <FontLoader />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}