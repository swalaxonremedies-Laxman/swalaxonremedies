import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Swalaxon Trade Hub',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
        {children}
    </div>
  );
}
