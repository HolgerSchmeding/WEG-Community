'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ClientRef from '@/components/_client-ref';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ClientRef />
      <Header />
      <Breadcrumbs />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
