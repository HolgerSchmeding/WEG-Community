import { NextRequest, NextResponse } from 'next/server';

// Temporäre Mock-Implementierung bis GenKit funktioniert
function mockImproveAgendaItem(title: string, description: string) {
  // Einfache Verbesserungslogik basierend auf häufigen WEG-Begriffen
  const improvedTitle = improveTitleLogic(title);
  const improvedDescription = improveDescriptionLogic(title, description);

  return {
    improvedTitle,
    improvedDescription,
    legalNotes: getLegalNotes(title, description),
    voteRequired: requiresVote(title, description),
  };
}

function improveTitleLogic(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('heizung')) {
    return 'Beschlussfassung über Instandsetzungsmaßnahmen der Heizungsanlage';
  }
  if (lowerTitle.includes('dach')) {
    return 'Beschlussfassung über Dachsanierungsmaßnahmen am Gemeinschaftseigentum';
  }
  if (lowerTitle.includes('hausordnung')) {
    return 'Änderung der Hausordnung';
  }
  if (lowerTitle.includes('verwaltung')) {
    return 'Bericht der Hausverwaltung über außergewöhnliche Geschäftsvorfälle';
  }
  if (lowerTitle.includes('kosten') || lowerTitle.includes('geld')) {
    return 'Beschlussfassung über außergewöhnliche Aufwendungen';
  }
  if (lowerTitle.includes('pv') || lowerTitle.includes('solar')) {
    return 'Beschlussfassung über Installation einer Photovoltaikanlage';
  }

  // Fallback: Erste Buchstabe groß + "betreffend" hinzufügen
  return `Beschlussfassung betreffend ${title.charAt(0).toUpperCase() + title.slice(1)}`;
}

function improveDescriptionLogic(title: string, description: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();

  if (lowerTitle.includes('heizung')) {
    return `Aufgrund von ${description} an der Heizungsanlage ist eine Instandsetzung erforderlich. Der Verwaltungsbeirat hat Kostenvoranschläge eingeholt und empfiehlt die Durchführung der Reparaturmaßnahmen zum Erhalt der ordnungsgemäßen Beheizung des Gemeinschaftseigentums.`;
  }

  if (lowerTitle.includes('dach')) {
    return `Es sind Schäden am Dach festgestellt worden: ${description}. Zur Vermeidung von Folgeschäden und zur Erhaltung der Bausubstanz wird eine fachgerechte Sanierung empfohlen.`;
  }

  if (lowerTitle.includes('hausordnung')) {
    return `Die bestehende Hausordnung soll überarbeitet werden. Geplante Änderungen: ${description}. Die neue Hausordnung bedarf der Zustimmung aller Wohnungseigentümer.`;
  }

  // Fallback
  return `Betreffend ${title}: ${description}. Eine Beschlussfassung durch die Eigentümergemeinschaft ist erforderlich.`;
}

function getLegalNotes(title: string, description: string): string | undefined {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('hausordnung')) {
    return 'Änderungen der Hausordnung erfordern Einstimmigkeit aller Wohnungseigentümer (§ 15 WEG).';
  }

  if (lowerTitle.includes('umbau') || lowerTitle.includes('modernisierung')) {
    return 'Bauliche Veränderungen können eine qualifizierte Mehrheit erfordern (§ 22 WEG).';
  }

  return undefined;
}

function requiresVote(title: string, description: string): boolean {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Berichte erfordern keine Abstimmung
  if (lowerTitle.includes('bericht')) return false;

  // Die meisten anderen Punkte erfordern eine Abstimmung
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = mockImproveAgendaItem(
      body.title.trim(),
      body.description?.trim() || ''
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error improving agenda item:', error);
    return NextResponse.json(
      {
        error: 'Failed to improve agenda item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
