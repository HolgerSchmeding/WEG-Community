import { NextRequest, NextResponse } from 'next/server';

interface SearchQuery {
  query: string;
  mode: 'text' | 'ai';
  documents: any[];
  userRole?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, mode, documents, userRole }: SearchQuery = await request.json();

    if (!query.trim()) {
      return NextResponse.json({ results: documents, summary: 'Alle Dokumente angezeigt.' });
    }

    if (mode === 'ai') {
      // KI-basierte Suche (simuliert)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Erweiterte semantische Suche
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
      const synonyms: { [key: string]: string[] } = {
        'heizung': ['wärme', 'temperatur', 'heizen', 'energie'],
        'müll': ['abfall', 'entsorgung', 'container', 'reinigung'],
        'lärm': ['ruhe', 'lärmschutz', 'geräusch', 'nachbarschaft'],
        'parken': ['fahrzeug', 'auto', 'stellplatz', 'garage'],
        'garten': ['grün', 'bepflanzung', 'außenanlage', 'spielplatz'],
        'versammlung': ['meeting', 'sitzung', 'protokoll', 'beschluss'],
        'kosten': ['geld', 'euro', 'finanz', 'ausgaben', 'budget'],
        'reparatur': ['sanierung', 'instandhaltung', 'wartung'],
        'eigentümer': ['besitzer', 'wohnung', 'immobilie'],
        'verwaltung': ['hausverwaltung', 'verwalter', 'beirat']
      };

      const expandedTerms = [...searchTerms];
      searchTerms.forEach(term => {
        if (synonyms[term]) {
          expandedTerms.push(...synonyms[term]);
        }
      });

      // Frage-Kontext erkennen
      const questionWords = ['was', 'wie', 'wann', 'wo', 'wer', 'warum', 'welche', 'gibt es', 'kann ich', 'darf ich'];
      const isQuestion = questionWords.some(word => query.toLowerCase().includes(word));

      const results = documents.filter((doc: any) => {
        const searchableText = `${doc.title} ${doc.content} ${doc.tags?.join(' ') || ''}`.toLowerCase();
        return expandedTerms.some(term => searchableText.includes(term));
      }).sort((a: any, b: any) => {
        // Relevanz-Score berechnen
        const scoreA = expandedTerms.reduce((score, term) => {
          const titleMatch = a.title.toLowerCase().includes(term) ? 5 : 0;
          const contentMatch = a.content.toLowerCase().includes(term) ? 2 : 0;
          const tagMatch = a.tags?.some((tag: string) => tag.toLowerCase().includes(term)) ? 3 : 0;
          return score + titleMatch + contentMatch + tagMatch;
        }, 0);
        
        const scoreB = expandedTerms.reduce((score, term) => {
          const titleMatch = b.title.toLowerCase().includes(term) ? 5 : 0;
          const contentMatch = b.content.toLowerCase().includes(term) ? 2 : 0;
          const tagMatch = b.tags?.some((tag: string) => tag.toLowerCase().includes(term)) ? 3 : 0;
          return score + titleMatch + contentMatch + tagMatch;
        }, 0);
        
        return scoreB - scoreA;
      });

      let summary = `KI-Suche nach "${query}" gefunden: ${results.length} relevante Dokumente`;
      if (isQuestion) {
        summary += ". Frage erkannt - Ergebnisse nach Relevanz sortiert";
      }
      if (expandedTerms.length > searchTerms.length) {
        summary += `. Suche erweitert um verwandte Begriffe`;
      }

      return NextResponse.json({ results, summary, mode: 'ai' });
    } else {
      // Einfache Textsuche
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      const results = documents.filter((doc: any) => {
        const searchableText = `${doc.title} ${doc.content}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
      });

      return NextResponse.json({ 
        results, 
        summary: `Textsuche nach "${query}": ${results.length} Treffer`,
        mode: 'text'
      });
    }
  } catch (error) {
    console.error('Suchfehler:', error);
    return NextResponse.json({ error: 'Suchfehler' }, { status: 500 });
  }
}
