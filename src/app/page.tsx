import Link from 'next/link';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { Home, KeyRound, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-primary/5">
      <header className="bg-white">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-md">
              <Logo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold font-headline">Silberbach WEG</h1>
              <p className="text-sm text-muted-foreground">Baden-Baden</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="container text-center max-w-4xl mx-auto">
          <div className="inline-block bg-primary/20 p-3 rounded-lg mb-6">
             <Home className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Willkommen bei der WEG Silberbach
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ihre zentrale Plattform für alle Belange der Wohneigentümergemeinschaft. Wählen Sie Ihren Bereich aus, um auf die für Sie relevanten Informationen und Funktionen zuzugreifen.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardCard
              href="/dashboard"
              icon={<Home className="h-8 w-8 text-white" />}
              iconBg="bg-primary"
              title="Bewohner"
              description="Alltag & Infos für Bewohner:innen"
            />
            <DashboardCard
              href="/owner"
              icon={<KeyRound className="h-8 w-8 text-white" />}
              iconBg="bg-secondary"
              title="Wohnungseigentümer"
              description="Dokumente & Beschlüsse für Eigentümer:innen"
            />
            <DashboardCard
              href="/board"
              icon={<Users className="h-8 w-8 text-white" />}
              iconBg="bg-accent"
              title="WEG-Verwaltungsbeirat"
              description="Interna & Aufgaben des WEG-Verwaltungsbeirats"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DashboardCard({ href, icon, iconBg, title, description }: { href: string; icon: React.ReactNode; iconBg: string; title: string; description: string; }) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
        <CardContent className="p-8 py-12 flex flex-col items-center text-center">
            <div className={`p-4 rounded-lg ${iconBg} mb-6`}>
              {icon}
            </div>
            <CardTitle className="font-headline text-xl mb-2 font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
