import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Admin Login - Swalaxon Trade Hub',
};

export default function LoginRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      {children}
      <Toaster />
    </FirebaseClientProvider>
  );
}
