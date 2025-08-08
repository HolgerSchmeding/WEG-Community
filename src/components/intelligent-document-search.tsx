"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Sparkles, 
  Filter, 
  FileText, 
  Calendar, 
  Tag, 
  Clock,
  X,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
// import { runFlow } from '@genkit-ai/next/client';
// import { intelligentDocumentSearch, type DocumentSearchInput } from '@/ai/flows/document-search';

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  date: string;
  author: string;
  tags: string[];
  permissions: string[];
}

interface IntelligentDocumentSearchProps {
  documents: Document[];
  onDocumentSelect: (document: Document) => void;
  userRole?: string;
}

interface SearchFilters {
  category: string;
  type: string;
  dateRange: string;
  author: string;
}

export function IntelligentDocumentSearch({ 
  documents, 
  onDocumentSelect,
  userRole = 'resident' 
}: IntelligentDocumentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Document[]>(documents);
  const [isAISearching, setIsAISearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'ai'>('text');
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    type: "all", 
    dateRange: "all",
    author: "all"
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filtere Dokumente basierend auf Benutzerrolle
  const accessibleDocuments = useMemo(() => {
    return documents.filter(doc => 
      doc.permissions.includes('all') || 
      doc.permissions.includes(userRole) ||
      (userRole === 'admin' && doc.permissions.includes('board')) ||
      (userRole === 'board' && doc.permissions.includes('owner'))
    );
  }, [documents, userRole]);

  // Eindeutige Werte für Filter-Optionen
  const filterOptions = useMemo(() => {
    const categories = [...new Set(accessibleDocuments.map(doc => doc.category))];
    const types = [...new Set(accessibleDocuments.map(doc => doc.type))];
    const authors = [...new Set(accessibleDocuments.map(doc => doc.author))];
    
    return { categories, types, authors };
  }, [accessibleDocuments]);

  // Einfache Textsuche
  const performTextSearch = (query: string, docs: Document[]) => {
    if (!query.trim()) return docs;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return docs.filter(doc => {
      const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    }).sort((a, b) => {
      // Relevanz-Score basierend auf Titel-Matches
      const aScore = searchTerms.reduce((score, term) => 
        score + (a.title.toLowerCase().includes(term) ? 2 : 0) +
                (a.content.toLowerCase().includes(term) ? 1 : 0), 0
      );
      const bScore = searchTerms.reduce((score, term) => 
        score + (b.title.toLowerCase().includes(term) ? 2 : 0) +
                (b.content.toLowerCase().includes(term) ? 1 : 0), 0
      );
      return bScore - aScore;
    });
  };

  // KI-basierte Kontextsuche (simuliert)
  const performAISearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(applyFilters(accessibleDocuments));
      return;
    }

    setIsAISearching(true);
    try {
      // Simuliere KI-Verarbeitung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erweiterte Textsuche mit semantischer Ähnlichkeit
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
      const synonyms = {
        'heizung': ['wärme', 'temperatur', 'heizen'],
        'müll': ['abfall', 'entsorgung', 'container'],
        'lärm': ['ruhe', 'lärmschutz', 'geräusch'],
        'parken': ['fahrzeug', 'auto', 'stellplatz'],
        'garten': ['grün', 'bepflanzung', 'außenanlage'],
        'versammlung': ['meeting', 'sitzung', 'protokoll'],
        'kosten': ['geld', 'euro', 'finanz', 'ausgaben']
      };

      const expandedTerms = [...searchTerms];
      searchTerms.forEach(term => {
        if (synonyms[term as keyof typeof synonyms]) {
          expandedTerms.push(...synonyms[term as keyof typeof synonyms]);
        }
      });

      const aiResults = accessibleDocuments.filter(doc => {
        const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
        return expandedTerms.some(term => searchableText.includes(term));
      }).sort((a, b) => {
        // Score basierend auf Anzahl gefundener Begriffe und Position
        const aScore = expandedTerms.reduce((score, term) => {
          const titleMatch = a.title.toLowerCase().includes(term) ? 3 : 0;
          const contentMatch = a.content.toLowerCase().includes(term) ? 1 : 0;
          const tagMatch = a.tags.some(tag => tag.toLowerCase().includes(term)) ? 2 : 0;
          return score + titleMatch + contentMatch + tagMatch;
        }, 0);
        
        const bScore = expandedTerms.reduce((score, term) => {
          const titleMatch = b.title.toLowerCase().includes(term) ? 3 : 0;
          const contentMatch = b.content.toLowerCase().includes(term) ? 1 : 0;
          const tagMatch = b.tags.some(tag => tag.toLowerCase().includes(term)) ? 2 : 0;
          return score + titleMatch + contentMatch + tagMatch;
        }, 0);
        
        return bScore - aScore;
      });

      setSearchResults(applyFilters(aiResults));
    } catch (error) {
      console.error('KI-Suche fehlgeschlagen:', error);
      // Fallback zu Textsuche
      const textResults = performTextSearch(query, accessibleDocuments);
      setSearchResults(applyFilters(textResults));
    } finally {
      setIsAISearching(false);
    }
  };

  // Filter anwenden
  const applyFilters = (docs: Document[]) => {
    let filtered = [...docs];

    if (filters.category !== "all") {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }
    if (filters.type !== "all") {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }
    if (filters.author !== "all") {
      filtered = filtered.filter(doc => doc.author === filters.author);
    }
    if (filters.dateRange !== "all") {
      const now = new Date();
      const docDate = new Date();
      
      switch (filters.dateRange) {
        case "week":
          docDate.setDate(now.getDate() - 7);
          break;
        case "month":
          docDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          docDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (filters.dateRange !== "all") {
        filtered = filtered.filter(doc => new Date(doc.date) >= docDate);
      }
    }

    return filtered;
  };

  // Suche ausführen
  const handleSearch = async () => {
    if (searchMode === 'ai') {
      await performAISearch(searchQuery);
    } else {
      const textResults = performTextSearch(searchQuery, accessibleDocuments);
      setSearchResults(applyFilters(textResults));
    }
  };

  // Filter ändern
  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Aktive Filter aktualisieren
    const newActiveFilters = Object.entries(newFilters)
      .filter(([_, v]) => v !== "all")
      .map(([k, v]) => `${k}: ${v}`);
    setActiveFilters(newActiveFilters);
    
    // Filter sofort anwenden
    setSearchResults(applyFilters(searchResults));
  };

  // Filter zurücksetzen
  const clearFilters = () => {
    const clearedFilters = {
      category: "all",
      type: "all",
      dateRange: "all", 
      author: "all"
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    setSearchResults(applyFilters(accessibleDocuments));
  };

  // Enter-Taste für Suche
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Such-Interface */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Intelligente Dokumentensuche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suchleiste */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Suchen Sie nach Begriffen oder stellen Sie eine Frage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults(applyFilters(accessibleDocuments));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Suchmodus Toggle */}
            <Select value={searchMode} onValueChange={(value: 'text' | 'ai') => setSearchMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Text
                  </div>
                </SelectItem>
                <SelectItem value="ai">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    KI
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={isAISearching}>
              {isAISearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : searchMode === 'ai' ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Suchfilter</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Kategorie</Label>
                      <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle</SelectItem>
                          {filterOptions.categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Dokumenttyp</Label>
                      <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle</SelectItem>
                          {filterOptions.types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Zeitraum</Label>
                      <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle</SelectItem>
                          <SelectItem value="week">Letzte Woche</SelectItem>
                          <SelectItem value="month">Letzter Monat</SelectItem>
                          <SelectItem value="year">Letztes Jahr</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Autor</Label>
                      <Select value={filters.author} onValueChange={(value) => handleFilterChange('author', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle</SelectItem>
                          {filterOptions.authors.map(author => (
                            <SelectItem key={author} value={author}>{author}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {activeFilters.length > 0 && (
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Alle Filter zurücksetzen
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Aktive Filter anzeigen */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          )}

          {/* Suchmodus Info */}
          <div className="text-sm text-muted-foreground">
            {searchMode === 'ai' ? (
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-600" />
                KI-Modus: Kontextuelle Suche mit semantischem Verständnis
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                Text-Modus: Direkte Begriffsuche in Titel und Inhalt
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suchergebnisse */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {searchQuery ? `Suchergebnisse für "${searchQuery}"` : 'Alle Dokumente'}
          </h3>
          <Badge variant="outline">
            {searchResults.length} von {accessibleDocuments.length} Dokumenten
          </Badge>
        </div>

        {searchResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Keine Dokumente gefunden</h4>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Versuchen Sie andere Suchbegriffe oder passen Sie die Filter an."
                  : "Es sind keine Dokumente verfügbar."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          searchResults.map((doc) => (
            <Card key={doc.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4" onClick={() => onDocumentSelect(doc)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base mb-2 line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {doc.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.date).toLocaleDateString('de-DE')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {doc.category}
                      </div>
                      <div>{doc.author}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{doc.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
