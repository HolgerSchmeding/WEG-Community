import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { keywords, context, discussion } = await request.json();

    if (!keywords || !context) {
      return NextResponse.json(
        { error: 'Keywords und Context sind erforderlich' },
        { status: 400 }
      );
    }

    // Mock KI-Verbesserung für WEG-spezifische Protokollierung
    // In Produktion würde hier die echte GenKit AI API aufgerufen werden
    const improvedText = await generateProtocolText(
      keywords,
      context,
      discussion
    );

    return NextResponse.json({
      improvedText,
      success: true,
    });
  } catch (error) {
    console.error('Protokoll-Verbesserung Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Protokoll-Verbesserung' },
      { status: 500 }
    );
  }
}

async function generateProtocolText(
  keywords: string,
  context: string,
  discussion: string
): Promise<string> {
  // Simulierte Delay für realistische API-Antwort
  await new Promise(resolve => setTimeout(resolve, 1500));

  // WEG-spezifische Verbesserungslogik basierend auf Stichworte
  const keywordLower = keywords.toLowerCase();

  // Verschiedene Protokoll-Verbesserungen je nach Stichwort-Thema
  if (
    keywordLower.includes('instandhaltung') ||
    keywordLower.includes('reparatur')
  ) {
    return `**Diskussionspunkt Instandhaltung:**
Der Verwalter berichtete über die anstehenden Instandhaltungsmaßnahmen. Aus der Eigentümerschaft wurden folgende Punkte diskutiert: ${keywords}. 

Die Eigentümergemeinschaft erörterte die Dringlichkeit und Kostenschätzungen. Nach ausführlicher Beratung wurde der Kostenrahmen und die Ausführungsmodalitäten besprochen.`;
  }

  if (
    keywordLower.includes('hausgeld') ||
    keywordLower.includes('nachzahlung') ||
    keywordLower.includes('erhöhung')
  ) {
    return `**Diskussion Hausgeldangelegenheit:**
Die Verwaltung präsentierte die aktuelle Wirtschaftsplan-Situation. Bezüglich der Punkte "${keywords}" entwickelte sich eine lebhafte Diskussion unter den Eigentümern.

Es wurden verschiedene Finanzierungsoptionen erörtert und die Auswirkungen auf die einzelnen Eigentümer besprochen. Die Notwendigkeit der Maßnahme wurde grundsätzlich anerkannt.`;
  }

  if (keywordLower.includes('sonder') || keywordLower.includes('umlage')) {
    return `**Beratung Sonderumlage:**
Der Verwaltungsbeirat erläuterte die Notwendigkeit der beantragten Sonderumlage. Die Stichpunkte "${keywords}" bildeten den Kern der Diskussion.

Mehrere Eigentümer äußerten Bedenken bezüglich der Höhe und des Zeitpunkts. Alternative Finanzierungswege wurden diskutiert, jedoch als nicht praktikabel eingestuft.`;
  }

  if (
    keywordLower.includes('modernisierung') ||
    keywordLower.includes('sanierung')
  ) {
    return `**Modernisierungsvorhaben:**
Das geplante Modernisierungsvorhaben wurde ausführlich vorgestellt. Schwerpunkte der Diskussion waren: ${keywords}.

Die Eigentümergemeinschaft diskutierte über Nutzen, Kosten und mögliche Förderungen. Verschiedene Ausführungsvarianten wurden gegenübergestellt und bewertet.`;
  }

  if (keywordLower.includes('beirat') || keywordLower.includes('wahl')) {
    return `**Diskussion zu Beiratsangelegenheiten:**
Die Tagesordnung bezüglich "${context}" führte zu einer intensiven Aussprache. Kernpunkte waren: ${keywords}.

Die Eigentümer diskutierten über Kandidaten, Aufgabenbereiche und zukünftige Schwerpunkte. Die Bedeutung einer aktiven Beiratsarbeit wurde hervorgehoben.`;
  }

  // Standard-Verbesserung für alle anderen Fälle
  return `**Diskussion zu ${context}:**
Die Eigentümergemeinschaft beriet ausführlich über die vorgestellten Punkte. Zentrale Diskussionsthemen waren: ${keywords}.

${discussion ? `Vorherige Protokollnotizen: "${discussion}"\n\n` : ''}Die verschiedenen Standpunkte wurden eingehend erörtert. Nach ausführlicher Beratung kristallisierten sich die wesentlichen Aspekte heraus, die für die Entscheidungsfindung relevant sind.`;
}
