import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { TicketProvider } from '@/hooks/use-tickets';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/components/providers/auth-provider';
import { getSession } from '@/lib/auth';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Silberbach Community Hub',
  description: 'Zentrale Plattform für die WEG Silberbach',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased min-h-screen flex flex-col',
          fontInter.variable,
          fontSpaceGrotesk.variable
        )}
      >
        <ErrorBoundary
          showErrorDetails={process.env.NODE_ENV === 'development'}
        >
          <AuthProvider session={session}>
            <TicketProvider>{children}</TicketProvider>
          </AuthProvider>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
