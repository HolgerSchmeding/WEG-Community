'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Mapping der Pfade zu benutzerfreundlichen Namen
const pathMappings: Record<string, string> = {
  // Root level
  '': 'Startseite',
  'dashboard': 'Bewohner-Cockpit',
  'owner': 'Eigentümer-Cockpit',
  'board': 'Beirats-Bereich',
  'admin': 'Admin-Bereich',
  'role-test': 'Rollen-Test',
  
  // Main features
  'announcements': 'Aushangbrett',
  'appointments': 'Termine',
  'contact': 'Anfragen',
  'documents': 'Dokumente',
  'marketplace': 'Marktplatz',
  'surveys': 'Umfragen',
  
  // Board/Admin specific
  'meetings': 'Sitzungen',
  'users': 'Benutzerverwaltung',
  'tickets': 'Tickets',
  
  // Special pages
  'new': 'Neu erstellen',
  'archive': 'Archiv',
  'resident-appointments': 'Bewohner-Termine',
  
  // Actions
  'edit': 'Bearbeiten',
  'view': 'Ansehen',
};

// Spezielle Routen, die andere Startseiten haben
const routeContexts: Record<string, { root: string; rootLabel: string }> = {
  '/admin': { root: '/admin', rootLabel: 'Admin-Bereich' },
  '/board': { root: '/board', rootLabel: 'Beirats-Bereich' },
  '/owner': { root: '/owner', rootLabel: 'Eigentümer-Cockpit' },
  '/dashboard': { root: '/dashboard', rootLabel: 'Bewohner-Cockpit' },
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Nicht auf Root-Seiten oder Role-Test anzeigen
  if (pathname === '/' || pathname === '/role-test') {
    return null;
  }

  // Pfad in Segmente aufteilen und leere Segmente entfernen
  const segments = pathname.split('/').filter(segment => segment !== '');
  
  // Breadcrumb-Items erstellen
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  // Kontextuelle Root bestimmen
  let contextRoot = '/dashboard'; // Standard
  let contextRootLabel = 'Bewohner-Cockpit';
  
  for (const [routePrefix, context] of Object.entries(routeContexts)) {
    if (pathname.startsWith(routePrefix)) {
      contextRoot = context.root;
      contextRootLabel = context.rootLabel;
      break;
    }
  }
  
  // Root-Element hinzufügen (außer für Admin/Board/Owner die ihre eigene Root haben)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/board') && !pathname.startsWith('/owner')) {
    breadcrumbItems.push({
      label: 'Startseite',
      href: '/',
      icon: Home
    });
  }
  
  // Segments zu Breadcrumbs verarbeiten
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Dynamic IDs (wie [id]) überspringen, aber deren Labels hinzufügen
    if (segment.match(/^[0-9A-F-]{8,}$/i) || segment.startsWith('T2024')) {
      // Ticket-ID oder ähnliche IDs - Label hinzufügen aber nicht verlinkbar
      breadcrumbItems.push({
        label: `#${segment.substring(0, 10)}...`,
        href: currentPath
      });
      return;
    }
    
    // Label für das Segment bestimmen
    const label = pathMappings[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbItems.push({
      label,
      href: currentPath
    });
  });

  // Wenn nur ein Element vorhanden ist, keine Breadcrumbs anzeigen
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center space-x-1 text-sm text-muted-foreground py-2 px-4 bg-muted/30 border-b"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
              )}
              
              {isLast ? (
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 hover:text-foreground transition-colors",
                    "hover:underline focus:outline-none focus:underline"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
