import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/shared/header';
import { SiteFooter } from '@/components/shared/footer';
import { Toaster } from '@/components/ui/toaster';
import { EditorWrapper } from '@/components/admin/editor-wrapper';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Swalaxon Trade Hub',
  description: 'Your trusted partner for pharmaceutical and chemical raw materials.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <FirebaseClientProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main id="main-content" className="flex-1">{children}</main>
              <SiteFooter />
          </div>
          <EditorWrapper />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
