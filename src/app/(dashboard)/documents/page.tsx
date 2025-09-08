'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';
import { BackButton } from '@/components/back-button';

const houseRules = [
  {
    title: 'Geltungsbereich',
    content:
      'Die vorliegende Hausordnung basiert auf den Bestimmungen des Wohneigentumsgesetzes (WEG) sowie den Beschlüssen der Eigentümerversammlung. Mit ihr wird das gemeinschaftliche Miteinander und eine ordnungsgemäße Behandlung der Gebäude und Anlagen geregelt. Sie enthält Rechte und Pflichten, gilt für alle Bewohner und ist im gemeinsamen Interesse aller einzuhalten. Eigentümer, die ihren Wohnraum vermieten, müssen diese Hausordnung bereits bei Mietvertragsunter-zeichnung vom Mieter unterschreiben lassen.',
  },
  {
    title: 'Sicherheit',
    content:
      'Zum Schutz der Hausbewohner müssen die Keller- und Haustüren geschlossen bleiben. Bitte halten Sie ebenso die Garagentore geschlossen. Achten Sie darauf, dass Haus- und Hofeingänge, Treppen und Flure frei sind, weil Sie nur dann ihren Zweck als Fluchtwege erfüllen. Fahr- und Motor-räder etc. gehören nicht dorthin. Sie dürfen z.B. einen Kin-derwagen oder Rollator im Treppenhaus nur abstellen, wenn dadurch die Fluchtwege nicht eingeschränkt werden. Bitte halten Sie auch die Bestimmungen der Garagenordnung ein (https://www.landesrecht-bw.de/bsbw/document/jlr-GaVBW1997rahmen/part/X). \n\nAchten Sie bitte darauf, dass beim Blumengießen an Balko-nen, Fenstern oder Terrassen kein Wasser heruntertropft. \n\nZum Grillen sollen die Möglichkeiten an der „Schwedenhütte“ genutzt werden. Aus Sicherheitsgründen ist das Grillen auf Balkonen, Terrassen und auf den unmittelbar am Gebäude liegenden Flächen nur mit Elektro- oder Gasgrill erlaubt. Gelegentliches Grillen auf den Balkonen und Terrassen er-fordert nachbarschaftliche Rücksichtnahme.',
  },
  {
    title: 'Reinigung',
    content:
      'Halten Sie bitte im Interesse aller Bewohner Haus und Grundstück (Außenanlagen, Mülltonnenflächen) ständig sauber. Benutzen Sie Müllräume und Müllboxen möglichst nur in der Zeit von 8:00 bis 20:00 Uhr. Abfall und Unrat dürfen nur in den dafür vorgesehenen Müllgefäßen gesammelt wer-den. Bitte achten Sie darauf, dass kein Abfall oder Unrat im Haus auf den Zugangswegen oder dem Standplatz der Müll-gefäße verschüttet wird. Selbst verursachte Verunreinigun-gen sind vom jeweiligen Hausbewohner unverzüglich zu beseitigen. \n\nAuf eine konsequente Trennung des Mülls ist zu achten. \n\nFür die Entsorgung von Sperrmüll informieren Sie sich bitte bei der Stadtverwaltung und stellen Sie Ihren Sperrmüll erst zum Entsorgungstermin zur Abholung bereit. \n\nNach Benutzung einer der Gemeinschaftsanlagen, wie dem Grillplatz, der Schwedenhütte, dem Pavillon oder anderer Örtlichkeiten, reinigen Sie diese bitte umgehend, entsorgen Sie angefallenen Müll und verlassen Sie die Plätze sauber und ordentlich.',
  },
  {
    title: 'Lüftung und Heizung',
    content:
      'Belüften Sie Ihre Wohnung ausreichend. Der Austausch der Raumluft hat in der Regel durch wiederholte Stoßlüftung zu erfolgen. Sinkt die Außentemperatur unter den Gefrierpunkt, sind insbesondere Keller- und Treppenhausfenster – außer zum Lüften – sowie die Garagentore unbedingt geschlossen zu halten.',
  },
  {
    title: 'Schutz vor Lärm',
    content:
      'Lärm belastet alle Hausbewohner. Halten Sie deshalb die allgemeinen Ruhezeiten von 13:00 bis 15:00 Uhr und von 22:00 bis 7:00 Uhr ein und vermeiden jede über das normale Maß hinausgehende Lärmbelästigung. Stellen Sie Fernseh-, Rundfunkgeräte, andere Tonträger sowie Computer auf Zim-merlautstärke ein.\n\nFür Handwerksbetriebe gelten die gesetzlichen Ruhezeiten von 22:00 Uhr bis 6:00 Uhr. \n\nFeiern zu besonderen Anlässen dürfen nicht zu unzumutba-ren Lärmbelästigungen der Hausgemeinschaft führen. Spre-chen Sie bitte vorher mit den betroffenen Hausbewohnern.',
  },
  {
    title: 'Benutzung des Grundstücks',
    content:
      'Park und Außenbereiche sind sauber und ordentlich zu hal-ten. Die im Park vorhandenen Einrichtungen und Gartenmö-bel können von allen Bewohnern genutzt werden. Die Benut-zung ist ausdrücklich erwünscht.',
  },
  {
    title: 'Kinder',
    content:
      'Den Spielbedürfnissen von Kindern ist in angemessener Weise Rechnung zu tragen. Wenn Ihre Kinder und deren Freunde den vorhandenen Spielplatz auf dem oberen Be-reich des Grundstücks benutzen, achten Sie darauf, dass Sie Spielzeug und Abfälle nach Beendigung des Spielens ein-sammeln, und tragen Sie damit zur Sauberkeit des Spielplat-zes bei. Die Benutzung der Spielgeräte auf unseren Spiel-plätzen geschieht auf eigene Gefahr. Auch Ihre Kinder müs-sen beim Spielen die allgemeinen Ruhezeiten einhalten. Das Einbringen altersgerechte Spielgeräte, wie etwa Zelte oder Planschbecken sind im oberen Bereich des Grundstücks erlaubt.',
  },
  {
    title: 'Tiere',
    content:
      'Hunden und andere Haustiere sind so zu halten, dass von ihnen keine Störungen oder Belästigungen der Mitbewohner ausgehen. Hunde sind von den Spielplätzen fernzuhalten. Die von ihnen ausgehenden Verunreinigungen sind durch den Tierhalter zu entfernen. Werfen Sie keine Abfälle in die Grünanlagen und füttern Sie keine Tiere, insbesondere keine Tauben und fremde Katzen.',
  },
  {
    title: 'Fahrzeuge',
    content:
      'Das Abstellen von motorisierten Fahrzeugen auf den Gara-genzufahrten und den Grünflächen ist nicht gestattet. Bei Autos und Motorräder dürfen auf dem Grundstück keine Öl-wechsel und Reparaturarbeiten durchgeführt werden. Innen-raumreinigungen und kleinere Reinigungsarbeiten mit z.B. Schwamm und Eimer sind gestattet. \n\nBeim Befahren der Garagenzufahrten ist grundsätzlich Schrittgeschwindigkeit einzuhalten.',
  },
  {
    title: 'Eigentums- /Mieterwechsel',
    content:
      'Der Verkauf, Vermietung, Mieterwechsel und Erwerb einer Wohnung sind der Hausverwaltung mitzuteilen.',
  },
  {
    title: 'Sonstiges',
    content:
      'Schäden am Haus, den Verkehrswegen oder innerhalb des Grundstückes melden Sie bitte umgehend der Hausverwal-tung. Veränderungen in der Gartenanlage bedürfen der Zu-stimmung der Verwaltung bzw. der Eigentümergemeinschaft. Es dürfen keine Gegenstände an den Fassaden und Haus-wänden angebracht werden. Die Durchsetzung der Hausord-nung durch den Verwalter erfolgt im Rahmen der gesetzli-chen Bestimmungen.',
  },
];

export default function DocumentsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <BackButton href="/dashboard" text="Zurück zum Cockpit" />
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-block bg-primary/20 p-3 rounded-lg mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Hausordnung
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Die wichtigsten Regeln für ein gutes nachbarschaftliches Miteinander.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Hausordnung der WEG Silberbach
            </CardTitle>
            <CardDescription>
              Stand: März 2024. Die wichtigsten Regeln für ein gutes
              nachbarschaftliches Miteinander.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {houseRules.map((rule, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-semibold text-base text-left">
                    {rule.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-line">
                    {rule.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
