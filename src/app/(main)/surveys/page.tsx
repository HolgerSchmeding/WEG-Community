'use client';

import * as React from 'react';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Users, Clock, Vote, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const surveys = [
  {
    id: 1,
    title: 'Nutzung des Gemeinschaftsraums',
    description:
      'Wir möchten klären, wie der Gemeinschaftsraum im Untergeschoss zukünftig genutzt werden soll. Bitte geben Sie Ihre Präferenz an.',
    creator: 'Hausverwaltung',
    endDate: '31. August 2024',
    status: 'active',
    options: [
      { id: 'opt1', label: 'Als Fitnessraum ausbauen', votes: 28 },
      { id: 'opt2', label: 'Als Co-Working-Space einrichten', votes: 15 },
      { id: 'opt3', label: 'Als Kinderspielzimmer gestalten', votes: 22 },
      { id: 'opt4', label: 'Keine Änderung, bleibt Lagerfläche', votes: 5 },
    ],
  },
  {
    id: 2,
    title: 'Anschaffung von E-Lade-Stationen',
    description:
      'Sollen in der Tiefgarage E-Lade-Stationen installiert werden? Die Kosten würden über eine Sonderumlage finanziert.',
    creator: 'WEG-Verwaltungsbeirat',
    endDate: '15. Juli 2024',
    status: 'closed',
    options: [
      { id: 'opt1_2', label: 'Ja, ich bin dafür', votes: 45 },
      { id: 'opt2_2', label: 'Nein, ich bin dagegen', votes: 12 },
    ],
  },
];

export default function SurveysPage() {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  return (
    <div className="container py-8">
      <BackButton text="Zurück zum Cockpit" />

      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="inline-block bg-orange-500/20 p-4 rounded-lg mb-6">
          <CheckSquare className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Umfragen & Abstimmungen
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Nehmen Sie an aktuellen Umfragen teil und sehen Sie die Ergebnisse
          vergangener Abstimmungen ein.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-12 space-y-8">
        {surveys.map(survey => {
          const totalVotes = survey.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );
          const hasVoted = false; // In a real app, this would check user's voting status

          return (
            <Card key={survey.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl">
                      {survey.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {survey.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      survey.status === 'closed' ? 'secondary' : 'outline'
                    }
                    className={
                      survey.status === 'closed'
                        ? 'bg-gray-200 text-gray-800'
                        : 'text-green-600 border-green-600'
                    }
                  >
                    {survey.status === 'closed' ? 'Abgeschlossen' : 'Aktiv'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground pt-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Erstellt von: <strong>{survey.creator}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Endet am: {survey.endDate}
                  </span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Voting Area */}
                  <div>
                    <h3 className="font-semibold mb-4">Stimme abgeben</h3>
                    {survey.status === 'active' && !hasVoted ? (
                      <RadioGroup onValueChange={setSelectedOption}>
                        <div className="space-y-3">
                          {survey.options.map(option => (
                            <Label
                              key={option.id}
                              className="flex items-center gap-3 p-3 border rounded-md has-[:checked]:bg-accent has-[:checked]:border-primary cursor-pointer"
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                              />
                              <span>{option.label}</span>
                            </Label>
                          ))}
                        </div>
                        <Button className="mt-4 w-full">
                          <Vote className="mr-2 h-4 w-4" />
                          Stimme abgeben
                        </Button>
                      </RadioGroup>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 p-6 rounded-md h-full">
                        <CheckCircle className="h-8 w-8 mb-2" />
                        <p className="font-semibold">
                          {survey.status === 'closed'
                            ? 'Diese Umfrage ist beendet.'
                            : 'Sie haben bereits abgestimmt.'}
                        </p>
                        <p className="text-xs mt-1">
                          Die Ergebnisse sehen Sie nebenan.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Results Area */}
                  <div>
                    <h3 className="font-semibold mb-4">Aktuelles Ergebnis</h3>
                    <div className="space-y-4">
                      {survey.options.map(option => {
                        const percentage =
                          totalVotes > 0
                            ? (option.votes / totalVotes) * 100
                            : 0;
                        return (
                          <div key={option.id}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span className="font-medium">
                                {option.label}
                              </span>
                              <span className="text-muted-foreground">
                                {option.votes} Stimme(n) (
                                {percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4" />
                        <strong>{totalVotes}</strong> Personen haben insgesamt
                        teilgenommen.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {surveys.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <CheckSquare className="mx-auto h-12 w-12 mb-4" />
            <h3 className="font-headline text-xl font-semibold">
              Keine aktiven Umfragen
            </h3>
            <p>
              Momentan gibt es keine Umfragen, an denen Sie teilnehmen können.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
