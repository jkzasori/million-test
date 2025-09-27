import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '../presentation/components/ErrorBoundary';

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
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var html = document.documentElement;
              
              function showPage() {
                html.classList.add('fonts-loaded');
                html.style.visibility = 'visible';
                html.style.opacity = '1';
              }
              
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(showPage);
              } else {
                setTimeout(showPage, 100);
              }
              
              setTimeout(showPage, 500);
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}