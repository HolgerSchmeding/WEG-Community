
'use server';
/**
 * @fileOverview An AI assistant for the advisory board.
 *
 * - chatWithBoardAssistant - A function that handles the chat process.
 * - BoardAssistantInput - The input type for the chatWithBoardAssistant function.
 * - BoardAssistantOutput - The return type for the chatWithBoardAssistant function.
 */

import {ai} from '@/ai/genkit';
import {Message, z} from 'genkit';

const BoardAssistantInputSchema = z.object({
    history: z.array(Message.schema).describe('The chat history.'),
    newMessage: z.string().describe('The new message from the user.'),
});
export type BoardAssistantInput = z.infer<typeof BoardAssistantInputSchema>;

const BoardAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI's answer."),
});
export type BoardAssistantOutput = z.infer<typeof BoardAssistantOutputSchema>;

export async function chatWithBoardAssistant(
  input: BoardAssistantInput
): Promise<BoardAssistantOutput> {
  const chatWithBoardAssistantFlow = ai.defineFlow(
    {
      name: 'chatWithBoardAssistantFlow',
      inputSchema: BoardAssistantInputSchema,
      outputSchema: BoardAssistantOutputSchema,
    },
    async ({history, newMessage}) => {
      const {text} = await ai.generate({
        prompt: newMessage,
        history: history,
        system: `Sie sind ein hilfsbereiter KI-Assistent für Mitglieder eines WEG-Verwaltungsbeirats in Deutschland. Ihr Spezialgebiet ist das deutsche Wohnungseigentumsgesetz (WEG). Beantworten Sie Fragen präzise und professionell. Geben Sie keine Rechtsberatung, sondern erklären Sie die Sachverhalte basierend auf den gesetzlichen Grundlagen.

Nutzen Sie die folgenden Texte als Ihre primäre und umfassende Wissensgrundlage. Stützen Sie Ihre Antworten ausschließlich auf die hier bereitgestellten Informationen:

---
Der Verwaltungsbeirat der WEG – Aufgaben und Pflichten, Haftung inkl. WEG-Reform 2020
Änderungen im Hinblick auf den Verwaltungsbeirat durch das WEMoG 2020
Das Gesetz zur Modernisierung des Wohnungseigentumsgesetzes (WEMoG) hat als wesentliches Ziel auch die Stärkung des Verwaltungsbeirats. Im Gesetzesentwurf des Bundesministeriums für Justiz wurde Folgendes herausgehoben:
Der Entwurf sieht eine Stärkung des Verwaltungsbeirats als wichtigem Kontrollorgan vor. Die Tätigkeit im Verwaltungsbeirat soll attraktiver werden, indem die Haftung der Mitglieder des Verwaltungsbeirats auf Vorsatz und grobe Fahrlässigkeit beschränkt wird (§ 29 Absatz 3 WEG-E). Zudem sieht der Entwurf eine Flexibilisierung dahingehend vor, dass die
Wohnungseigentümer die Größe des Verwaltungsbeirats nach den Bedürfnissen ihrer konkreten Gemeinschaft festlegen können (§ 29 Absatz 1 WEG-E).
Auf dieser Webseite finden Sie weiterhin die bis 1. Dezember 2020 geltenden Regelungen zum Beirat und in diesem Abschnitt die aktuellen Änderungen. Wir werden sukzessive auch den unteren Text an die aktuelle Rechtssprechung anpassen sobald bekannt ist, wie die Neuerungen die Situation verändern.
Geänderte Grundlagen des Verwaltungsbeirats nach dem WEMoG
Anzahl der Mitglieder des Beirates
Es wurden wesentliche Flexibilisierungen des Verwaltungsbeirates beschlossen. Nach neuem Recht ist nunmehr keine Mindestanzahl an Mitgliedern des Verwaltungsbereits vorgesehen. Gleiches gilt jedoch auch für die maximale Größe. Die WEG hat hier im Rahmen der ordnungsgemäßen Verwaltung ein Ermessen. Bei großen Gemeinschaften sind weiterhin wohl jedoch bei Bereitschaft der Eigentümer mehrere Beiratsmitglieder zu wählen. Es sollte ein ungerade Beiratsbesetzung erfolgen, wenn der Vorsitzende nicht durch die WEG bestimmt wird.
Bestimmung des Vorsitzenden und der Beisitzer
Im Zusammenhang mit der Wahl ist ebenfalls zu bestimmen, wer Vorsitzendes und Beisitzender ist. Wird dies nicht bereits im Beschluss der Wohnungseigentümer bestimmt, kann dies auch durch die gewählten Beiratsmitglieder erfolgen. Dies sieht der Gesetzentwurf in der Begründung ausdrücklich vor. Es sollte deshalb auch darauf geachtet werden, dass eindeutige Mehrheiten möglich sind und der Beirat ungerade besetzt wird. Bei nur einem Beiratsmitglied ist dieser sogleich Vorsitzender.
Wahl eines Nichteigentümers zum Beirat
Die Wahl eines NIchteigentümers war bis Dezember noch jedenfalls im Rahmen des Verstoßes zum Grundsatz der ordnungsgemäßen Verwaltung möglich. Ein davon abweichender Beschluss war nur anfechtbar. Die neue Formulierung des Gesetzes legt jedoch nahe, dass hierfür aktuell keine Beschlusskompetenz mehr besteht, da nunmehr explizit festgeschrieben ist, dass der Beschluss nur einen Wohnungseigentümer bestellen kann. Abweichende Beschlüsse wären damit nichtig. Es bleibt abzuwarten, wie sich die Rechtssprechung hier positioniert. Große Gemeinschaften, die bereits Wirtschaftsprüfer / Steuerberater / Rechtsanwälte als Beirat zur Kontrolle der Verwaltung eingesetzt haben, sind davon betroffen.
§ 29 WEG n.F.
(1) Wohnungseigentümer können durch Beschluss zum Mitglied des Verwaltungsbeirats bestellt werden.
Rechte des Beirats und die Eigentümerversammlung
Einberufung der Eigentümerversammlung
Eine Eigentümerversammlung kann weiterhin auch vom  Verwaltungsbeiratsvorsitzenden oder seinem Vertreter bei pflichtwidriger Weigerung zur Einberufung und bei fehlen eines Verwalters erfolgen. Hier hat sich nichts geändert. Es kann neuerdings aber auch ein Beschluss gefasst werden, welcher einen Eigentümer zur Einberufung ermächtigt. Dies sollte zur Vermeidung von Schwierigkeiten als Vorratsbeschluss erfolgen.
Unterstützung und Überwachung der Verwaltung
Die Aufgaben und Pflichten des Verwaltungsbeirates sind nunmehr in § 29 Abs. 2 n.F. WEG geregelt worden. Dort heißt es:
Der Verwaltungsbeirat unterstützt und überwacht den Verwalter bei der Durchführung seiner Aufgaben. Der Wirtschaftsplan und die Jahresabrechnung sollen, bevor die Beschlüsse nach § 28 Abs. 1 Satz 1 und Absatz 2 Satz 1 gefasst werden, vom Verwaltungsbeirat geprüft werden und mit einer Stellungnahme versehen werden.
Die neue Regelung erweitert und beschränkt die Rechte des Verwaltungsbeirates zugleich. Durch den Gesetzesentwurf unbegründet ist die Regelung aufgenommen worden, dass der Verwaltungsbeirat nicht nur die Verwaltung unterstützt. sondern auch überwacht. Der Hintergrund der Aufnahme kann nur erahnt werden und ist vermutlich auf die Eigentümerinteressenverbände zurückzuführen, welche stets eine Stärkung des Beirats gefordert haben.
Dies führt für einen Beirat jedoch auch zu einem Risiko, da durch die Erweiterung der Befugnis bei der Bestellung zum Beirat auch eine Pflicht der Beiratsmitglieder zur Überwachung entsteht. Es drohen bei Nichtüberwachung des Verwalters auch Haftungsrisiken für den Beirat. Es stellt sich insofern die Frage, was bei einer fehlenden Tätigkeit des Beirats für die (Wiederbestellung und für die Haftung) gilt. Analogien zum Aktienrecht (hier der Aufsichtsrat) kommen in Betracht. Relevant wird hier sicherlich lediglich ein Sachverhalt bei Insolvenz des Verwalters und fehlender Versicherung. Aus Eigennutz sollte der Beirat deshalb auf die wirtschaftliche Liquidität der Verwaltung achten.
Umfang der Überwachungspflicht
Anhaltspunkt für die Überwachungspflicht wird unter Berücksichtigung des mit dem Gesetz verfolgten Ziels den Beirat für Eigentümer attraktiver zu machen, wohl aber zu beschränken sein, sodass nicht das Alltagsgeschäft, wohl aber wesentliche Verwaltungsmaßnahmen. Der Begriff wesentlich wird dabei in Abhängigkeit der Wohnungseigentümergemeinschaft für jeden Einzelfall zu bestimmen sein.
Ausdrücklich ausgenommen von der Prüfungspflicht sind jedoch die Unterstützung bei der Rechnungslegung und Kostenanschlägen soweit sie nicht Teil des Wirtschaftsplans / der Jahresabrechnung sind. Damit soll der Umfang der Tätigkeit des Beirats eigentlich begrenzt werden. Beiräte die dies prüfen möchten, haben über das nunmehr gesetzlich in § 18 geregelte Einsichtnahme Recht in alle Verwaltungsunterlagen sowie die Generalklausel zur Unterstützung / Überwachung der Verwaltung aber weiterhin die Möglichkeit.
Haftungsbegrenzung und Unentgeltlichkeit
Um die Haftung bei etwaigen Pflichtverletzungen zu begrenzen wurde für unentgeltlich tätig werdende Beiräte eine Haftungsbegrenzung auf grobe Fahrlässigkeit und Vorsatz vorgenommen. Dies ist zu begrüßen, wobei sich die Frage stellt, was unentgeltlich in diesem Zusammenhang bedeutet.
Wesentliche Frage, wann eine unentgeltlichkeit vorliegt, wurden im Gesetz nicht geregelt. Gleiches gilt für die Begründung. Hier droht derzeit Rechtsunsicherheit. In Anlehnung an § 3 Nr. 26a EStG sowie dem Vereinsrecht kommt eine Grenze von im Jahr 2020 720 € in Betracht. Leider wurde eine diskutierte direkte Verweisung auf § 31a BGB (und damit das Vereinsrecht) nicht vorgenommen, sodass die Frage offen bleibt. Da jedoch Aufwandsentschädigungen, auch pauschalisierte Aufwandsentschädigungen nach aktueller Rechtslage kein Entgelt sind, bleiben diese (im üblichen Rahmen) möglich und eine Gefährdung der Haftungsbegrenzung ausgeschlossen. Die Rechtssprechung kann jedoch in Haftungsprozesses des Beirates (welche selten sind), zu anderen Ergebnissen kommen. Dies scheint aber unwahrscheinlich.
Vermögensschadenshaftpflicht für Beiräte
JEDEM BEIRAT muss jedoch weiterhin bewusst sein, dass auch bei unentgeltlicher Tätigkeit eine Haftung mit dem gesamten Privatvermögen in Betracht kommt. Sollte die WEG-Verwaltung keine Rahmenversicherung für Beiräte haben, sollten Sie über eine eigene Beiratsversicherung als Haftpflichtversicherung nachdenken. Beispielsweise können Sie bei finanzchecks.de direkt online die Vermögensschadenhaftpflicht für Verwaltungsbeiräte nach § 29 WEG vergleichen.
Vertretung der Gemeinschaft der Wohnungseigentümer durch den Verwaltungsbeirat gegenüber der Verwaltung, § 9 b WEG n.F.
Die Grundkonzeption der WEG wurde geändert und der Verwalter als Vertretungsorgan der Gemeinschaft festgelegt. Die Gemeinschaft schließt kit dem WEG-Verwalter die Verträge. Es bedarf insofern keiner Vollmacht mehr zur Vertretung durch den Verwalter. Es stellte sich die Frage, wer bei Vertragsfragen und im Rahmen etwaige Haftungsansprüche die WEG vertreten soll. Der Gesetzgeber hat entschieden, dass dies grundsätzlich der WEG-Beirat oder ein durch Beschluss ermächtigter Eigentümer ist. Er vertritt in diesem Sinne kraft Gesetzes und beschränkt nur gegenüber der WEG-Verwaltung die Eigentümergemeinschaft. Dies hat den Vorteil, dass dadurch die Durchsetzung von Ansprüchen der WEG gegen den Verwalter vereinfacht werden. Es bedarf hier insbesondere keines Beschlusses. Der Beirat kann jedoch nicht auf Grundlage dieser Regelung einen Rechtsanwalt für die Gemeinschaft beauftragen. Denkbar wäre jedoch, dass die persönliche Beauftragung durch den Beirat im Rahmen des Aufwendungsersatzanspruchs gegenüber der WEG zu ersetzen ist. Die Entwicklung wird hier abzuwarten bleiben.
Die umfassende Vertretungsmacht des Beirats gegenüber dem Verwalter sagt jedoch nichts über dessen Vertretendürfen aus. In allen anderen außer in Angelegenheiten die dringlich oder nur fristwahrend möglich sind, ist deshalb dennoch ein Beschluss über das Vorgehen herbeizuführen. Hier geltend die Regelungen zum WEG-Verwalter entsprechend. Wird gegen den Willen der Mehrheit der Eigentümer gehandelt, drohen Schadenersatzansprüche.
Allgemeines zum Verwaltungsbeirat
Die Verwaltung des gemeinschaftlichen Eigentums wird der Gemeinschaft der Wohnungseigentümer nach § 18 WEG n.F. (seit 1. Dezember 2020) zugewiesen.
In § 18 WEG n.F. heißt es dazu:
(1) Die Verwaltung des gemeinschaftlichen Eigentums obliegt der Gemeinschaft der Wohnungseigentümer.
(2) Jeder Wohnungseigentümer kann von der Gemeinschaft der Wohnungseigentümer
1.	eine Verwaltung des gemeinschaftlichen Eigentums sowie
2.	eine Benutzung des gemeinschaftlichen Eigentums und des Sondereigentums
verlangen, die dem Interesse der Gesamtheit der Wohnungseigentümer nach billigem Ermessen (ordnungsmäßige Verwaltung und Benutzung) und, soweit solche bestehen, den gesetzlichen Regelungen, Vereinbarungen und Beschlüssen entsprechen.
(3) Jeder Wohnungseigentümer ist berechtigt, ohne Zustimmung der anderen Wohnungseigentümer die Maßnahmen zu treffen, die zur Abwendung eines dem gemeinschaftlichen Eigentum unmittelbar drohenden Schadens notwendig sind.
(4) Jeder Wohnungseigentümer kann von der Gemeinschaft der Wohnungseigentümer Einsicht in die Verwaltungsunterlagen verlangen.
Die Aufgabenverteilung in der Eigentümergemeinschaft
Dabei gilt zunächst der goldene Grundsatz, dass die Befugnisse zur Verwaltung der WEG grundsätzlich bei der Wohnungseigentümergemeinschaft und damit den jeweiligen Eigentümern liegen (vgl. § 19 WeG n.F.).
„ Regelung der Verwaltung und Benutzung durch Beschluss § 19  WEG
(1) Soweit die Verwaltung des gemeinschaftlichen Eigentums und die Benutzung des gemeinschaftlichen Eigentums und des Sondereigentums nicht durch Vereinbarung der Wohnungseigentümer geregelt sind, beschließen die Wohnungseigentümer eine ordnungsmäßige Verwaltung und Benutzung.
(2) Zur ordnungsmäßigen Verwaltung und Benutzung gehören insbesondere
1.	die Aufstellung einer Hausordnung,
2.	die ordnungsmäßige Erhaltung des gemeinschaftlichen Eigentums,
3.	die angemessene Versicherung des gemeinschaftlichen Eigentums zum Neuwert sowie der Wohnungseigentümer gegen Haus- und Grundbesitzerhaftpflicht
4.	die Ansammlung einer angemessenen Erhaltungsrücklage,
5.	die Festsetzung von Vorschüssen nach § 28 Absatz 1 Satz 1 sowi
6.	die Bestellung eines zertifizierten Verwalters nach § 26a, es sei denn, es bestehen weniger als neun Sondereigentumsrechte, ein Wohnungseigentümer wurde zum Verwalter bestellt und weniger als ein Drittel der Wohnungseigentümer (§ 25 Absatz 2) verlangt die Bestellung eines zertifizierten Verwalters.
Der Verwalter ist kein zentrales Machtorgan und hat nur sehr wenige eigene Befugnisse, welche er ohne entsprechende Weisung der Eigentümergemeinschaft ausüben darf. Dennoch ist der WEG-Verwalter zunächst als Vertreter zu jeglichen Handlungen berechtigt. Bei der Auswahl des WEG-Verwalters ist deshalb besondere Sorgfalt zu verwenden und die wirtschaftliche Liquidität zu prüfen. Ab 1. Dezember 2022 darf in größeren WEGs nur noch ein zertifizierter Verwalter nach § 26a WEG n.F. bestellt werden.
Die Wohnungseigentümergemeinschaft ist das weisungsbefugte Organ. Die WEG-Verwaltung hat die Aufgabe der Information, Vorbereitung und Durchführung von Beschlüssen der WEG (§ 23 WEG), soweit nicht eine Befugnis des Verwalter kraft Gesetzes besteht.
Es sollte dringend darüber nachgedacht werden, die gesetzlichen Befugnisse des WEG-Verwalters zu konkretisieren. Eine solche Erweiterung oder Beschränkung ist nach § 27 Abs. 2 WEG nunmehr möglich.
§ 27 Aufgaben und Befugnisse des Verwalters
(1) Der Verwalter ist gegenüber der Gemeinschaft der Wohnungseigentümer berechtigt und verpflichtet, die Maßnahmen ordnungsmäßiger Verwaltung zu treffen, di
1.	untergeordnete Bedeutung haben und nicht zu erheblichen Verpflichtungen führen oder
2.	zur Wahrung einer Frist oder zur Abwendung eines Nachteils erforderlich sind.
(2) Die Wohnungseigentümer können die Rechte und Pflichten nach Absatz 1 durch Beschluss einschränken oder erweitern.
Die Aufgaben des Beirats regelt § 29 Abs.2  WEG. Hierzu gehört zunächst die Unterstützung und Überwachung des Verwalters. Insbesondere sollen Wirtschaftsplan und Jahresabrechnung, bevor über sie die Wohnungseigentümergemeinschaft beschließt, vom Beirat kontrolliert und mit einer Stellungnahme versehen werden. Alle diese Aufgaben soll der Beirat zwar übernehmen, tut er es nicht, so sind diese Pflichten nicht einklagbar. Grundsätzlich stehen diese Tätigkeiten jedem Eigentümer frei, auch dann wenn es einen amtierenden Beirat gibt. Es bestehen jedoch die oben dargestellten Haftungsrisiken nach der WEG-Reform seit 1. Dezember 2020. Dies gilt auch für vorher bereits bestellte Beiräte.
gesetzliche Grundlage des Verwaltungsbeirats
Der Verwaltungsbeirat ist in § 29 WEG n.F.  geregelt. Dort heißt es:
§ 29 Verwaltungsbeirat
(1) Wohnungseigentümer können durch Beschluss zum Mitglied des Verwaltungsbeirats bestellt werden. Hat der Verwaltungsbeirat mehrere Mitglieder, ist ein Vorsitzender und ein Stellvertreter zu bestimmen. Der Verwaltungsbeirat wird von dem Vorsitzenden nach Bedarf einberufen.
(2) Der Verwaltungsbeirat unterstützt und überwacht den Verwalter bei der Durchführung seiner Aufgaben. Der Wirtschaftsplan und die Jahresabrechnung sollen, bevor die Beschlüsse nach § 28 Absatz 1 Satz 1 und Absatz 2 Satz 1 gefasst werden, vom Verwaltungsbeirat geprüft und mit dessen Stellungnahme versehen werden.
(3) Sind Mitglieder des Verwaltungsbeirats unentgeltlich tätig, haben sie nur Vorsatz und grobe Fahrlässigkeit zu vertreten.“
Dabei gilt, dass § 29 WEG umfassend abänderbar ist. Das bedeutet zum Beispiel, dass die Bestellung eines Beirates umfassend ausgeschlossen werden kann. Dies ist aber nur durch eine Vereinbarung möglich (allstimmig). Die Teilungserklärung oder eine nachträgliche Vereinbarungen können daher abweichende Bestimmungen von §29 WEG enthalten. Dies ist aber jedenfalls hinsichtlich der Aufgaben und Befugnisse sehr selten.
Ausgehend von §29 WEG selbst, ist die Wahl des Beirats lediglich eine Kann-Vorschrift. Das Gesetz schreibt die Wahl eines Beirates nicht zwingend vor. Wählt die Gemeinschaft keinen Beirat, so gibt es grundsätzlich keine einklagbaren Anspruch. Dies gilt insbesondere dann, wenn niemand sich für die Wahl zur Verfügung stellt.
Kurz:
Die Eigentümer entscheiden, der Verwalter führt die Entscheidungen aus und vertritt die Gemeinschaft nach außen, der Beirat überwacht / unterstützt die Tätigkeit des Verwalters und gibt hierzu gegenüber der Gemeinschaft eine Stellungnahme ab.
Sinn und Unsinn des Verwaltungsbeirates
Besonders in größeren Wohnungseigentümergemeinschaften hat sich die Wahl eines Beirats bewährt, da die Mehrzahl der Eigentümer weder willens, noch in der Lage ist, die Aufgaben des Beirats wahrzunehmen. Der Verwaltungsbeirat ist das Sprachrohr der Eigentümer zum Verwalter. Er ist die Stelle bei der die Eigentümer Anregungen, Fragen und Kritik vorbringen. Im Konfliktfall ist der Beirat Moderator der Diskussion und dient dem Ausgleich der verschiedenen Interessen innerhalb der Gemeinschaft.
Daher ist es sinnvoll, die Stellen des Beirates mit Eigentümern zu besetzen, die Rechtsanwälte, Steuerberater oder ähnliche Berufe haben. Das Wohnungseigentumsgesetz ist bei seiner Schaffung nicht von großen Eigentümergemeinschaften ausgegangen. Deshalb hat der Gesetzgeber es auch nicht für notwendig gehalten, einen Verwaltungsbeirat mit Personen zu besetzen, die nicht selbst auch Eigentümer sind. Vielmehr regelt §29 Abs.1 WEG ausdrücklich, dass der Beirat aus dem Kreise der Wohnungseigentümer gewählt wird. Auch bei der Reform des WEG hat der Gesetzgeber dies nicht geändert.
Allein die Existenz eines Beirates führt nicht dazu, dass der Einzeleigentümer kein Einsichtsrecht oder eigenes Prüfrecht hat. Jeder Eigentümer kann unabhängig vom Beirat jederzeit von seinem Einsichtsrecht beim Verwalter Gebrauch machen, sich sämtliche Unterlagen zeigen lassen und die Abrechnungen prüfen. Dies ist seit dem 1. Dezember 2018 auch gesetzlich in § 18 Abs. 4 WEG geregelt.
Die Bestellung des Verwaltungsbeirates
Bestellung und Beiratsvertrag
Wie auch bei der Verwalterbestellung ist zu unterscheiden zwischen der Bestellung als Organisationsakt und dem zugrundeliegenden schuldrechtlichen Verhältnis.
Durch die Wahl wird der Beirat als Verwaltungsorgan bestellt. Nicht ausdrücklich geregelt sind damit die vertraglichen Grundlagen wie zum Beispiel die Fragen einer Vergütung oder eines Aufwendungsersatzes, oder auch besonderer über das Gesetz hinausgehender Verpflichtungen. Der Abschluss eines solchen Beiratsvertrages kann beschlossen werden, bedarf aber eines ausdrücklichen Beschlusses und der separaten Annahme des Vertrags durch den jeweiligen Beirat außerhalb der Eigentümerversammlung (Achtung anderenfalls ist Beschlussnichtigkeit denkbar).
Gibt es kein ausdrückliches oder schriftliches Vertragsverhältnis, so liegt der Tätigkeit grundsätzlich ein unentgeltliches Auftragsverhältnis zugrunde (§§ 662,670  BGB)  Vertragspartner ist der Verband der Wohnungseigentümer als teilrechtsfähiger Verband.
Pflicht zur Beiratsbestellung?
Die Eigentümer können einen Verwaltungsbeirat bestellen. Das Gesetz eröffnet damit eine Möglichkeit, die jedoch keinen Anspruch auf Bestellung begründet. Findet sich niemand, der das Amt übernehmen möchte oder finden die Kandidaten nicht die erforderliche Mehrheit, dann hat die Gemeinschaft keinen Beirat und die Bestellung eines solchen kann auch nicht erzwungen werden.
Anders ist dies nur, wenn die Gemeinschaftsordnung einen Beirat zwingend vorschreibt. Dann kann dies einen Anspruch begründen. Auch dann wird der Anspruch kaum durchsetzbar sein, denn in den allermeisten Fällen wird sich niemand finden, der das Amt übernimmt. Eine andere Situation mag vorliegen, wenn Eigentümer abgelehnt werden ohne einen anderen Beirat zu wählen oder wählen zu können.
Wahl des Beirates
Die Wahl des Beirats erfolgt durch Mehrheitsbeschluss. Es reicht die einfache Mehrheit der in der Versammlung anwesenden Eigentümer, wenn die Gemeinschaftsordnung nichts anderes vorsieht.
Der zu wählende Eigentümer ist nicht gemäß §25 Abs. 5 von der Wahl ausgeschlossen, er hat eine Stimme und darf Vollmachten ausüben, auch dann wenn es um die Wahl seiner eigenen Person geht.  
Es ist üblich, dass sich die Kandidaten als Team zur Wahl stellen. Diese Blockwahl entspricht ordnungsgemäßer Verwaltung, es sei denn die Einzelwahl wird von einem Eigentümer verlangt (KGv. 29.3.2004- 24 W 194/02; KGReport Berlin 2004,571; NZM 2005,107; BGH v. 21.07.2003- II ZR 109/02 in NJW 2003,3412).
Bei der Einzelwahl wird einzeln über jeden Beirat abgestimmt und er muss dann jeweils eine einfache Mehrheit auf sich vereinigen.
Es gibt Gemeinschaftsordnungen, die für die Bestellung des Beirats die Einstimmigkeit vorsehen. Insbesondere in größeren Gemeinschaften wird man diese Einstimmigkeit kaum erreichen, allerdings ist gerade in diesen Gemeinschaften die Einrichtung eines Beirates sinnvoll. Besteht eine solche Regelung und hat die Gemeinschaft aber über Jahre hinweg den Beirat mit einfacher Mehrheit gewählt, so kann dies zu einer stillschweigenden Änderung einer solchen Vereinbarung führen, wenn angenommen werden kann dass alle Wohnungseigentümer auch künftig einen Mehrheitsbeschluss ausreichen lassen wollen, obwohl allen diese Regelung bekannt ist ( BayObLG v. 21.101993- NJW RR 1994,338f.). Die Rechtssprechung sollte aber mit Vorsicht angewendet werden. Gerade bei häufigen Eigentümerwechseln ist eine solche schuldrechtliche Vereinbarung nicht dauerhaft bestandskräftig. Es besteht insofern ein Anfechtungsrisiko.
Annahme der Bestellung durch den Beirat notwendig?
Der Beirat ist erst bestellt, wenn er die Wahl angenommen hat. Grundsätzlich liegt in der Kandidatur keine vorweggenommene Annahme. Dies findet seinen Grund darin, dass in der Regel die Bedingungen, zum Beispiel die Zusammensetzung und der Kreis der zu übernehmenden Aufgaben vor der Wahl noch nicht klar sind. Es kann aber niemandem das Amt aufgezwungen werden, insbesondere, wenn er die Bedingungen nicht kennt. Auch erfordert die spätere Übertragung weiterer Aufgaben, m. E. auch die Neuwahl eines einzelnen Mitglieds die Zustimmung der übrigen Beiräte. Darauf sollte bei einer entsprechenden Beschlussfassung geachtet werden.
Aufgabe des Beiratsamtes
Unberührt ist das grundsätzliche Recht jederzeit vom Amt zurückzutreten. Zu beachten sind hier jedoch einzelne vertraglich vereinbarte Besonderheiten, soweit die Gemeinschaft mit dem Beirat einen gesonderten Vertrag vereinbart hat.
Bestellungsdauer, Abberufung
Die Dauer der Bestellung kann auf unbestimmte Zeit erfolgen oder befristet werden. Anders als bei der Verwalterbestellung gibt es keine Höchstdauer für die Bestellzeit.
Ein Gleichlauf mit dem Bestellungszeitraum des Verwalters ist in der Praxis nicht zu empfehlen. Bei einem Verwalterwechsel kann ein gut funktionierender Beirat hilfreich sein.
Der Beirat selbst kann sein Amt jederzeit niederlegen. Tut er dies zur „Unzeit“, so kann dies Schadenersatzansprüche begründen (KG v. 8.1.1997-24 W 7947/95, ZMR 1997,544,545).
Die Bestellung ist grundsätzlich jederzeit per  Mehrheitsbeschluss, grundsätzlich ohne Angabe von Gründen widerruflich.
In Einzelfällen bedarf es zur  Abwahl eines wichtigen Grundes.  Dies ist dann der Fall, wenn für die Bestellung ein Mindestzeitraum vorgesehen ist (Abramenko, KK – WEG §29 WEG, Rz. 9).
Bei der Abberufung aus wichtigem Grund, ist der Beirat selbst nicht stimmberechtigt.
Liegt der Bestellung ein entgeltliches Geschäftsbesorgungsverhältnis zugrunde, dann ist dies grundsätzlich nur nach §314 BGB kündbar. Es gelten dann die im Einzelnen vereinbarten Regelungen.
Die Personen des Verwaltungsbeirates
Wer kann als Verwaltungsbeirat bestellt werden?
Das Beiratsmitglied kann nach vorherrschender Ansicht nur eine natürliche Person sein, die in der Geschäftsfähigkeit nicht eingeschränkt sein darf. Bei Gesellschaften können es einzelne Vorstandsmitglieder oder Geschäftsführer sein, wohl aber nicht die Gesellschaft als solche.
Der gesetzlichen Regelung nach muss das Beiratsmitglied ein Mitglied der Wohnungseigentümergemeinschaft sein. Der Gesetzgeber hat sich davon versprochen, dass der gewählte Beirat auf Grund seiner Mitgliedschaft ein besonderes Näheverhältnis zum Objekt hat und den Miteigentümern näher steht. Fakt ist aber, dass Miteigentümer zum einen nicht selten Partei ergreifen für dominierende Gruppen, oder aber es Ihnen  an der erforderlichen Neutralität fehlt, weil sie auch eigene Interessen haben. Zudem sind die Miteigentümer mit den an sie gestellten Aufgaben nicht selten zeitlich und fachlich überfordert. In den meisten Fällen übernimmt der Miteigentümer die Aufgabe unentgeltlich.  Gerade in größeren Gemeinschaften wäre die Wahl eines professionellen Beirats, der nicht selbst auch Mitglied der Gemeinschaft ist, sinnvoll. Der Gesetzgeber ist dieses Thema bei der letzten Reform jedoch nicht angegangen. Gegebenenfalls ist damit in der nächsten Legislaturperiode zu rechnen.
Die Wahl eines Außenstehenden, welcher nicht Miteigentümer ist,  kann nur durch Vereinbarung (einstimmig) zugelassen werden (BGH v. 26.1.2006- V ZB 132/05).
 Fehlt eine solche Vereinbarung und wird dennoch ein Außenstehender gewählt, dann wurde der Beschluss wirksam und bestandskräftig, wenn er nicht angefochten wird. Grund hierfür war die bestehende Beschlusskompetenz der Gemeinschaft zur Wahl eines Beirats, ohne die der Beschluss von Anfang an nichtig wäre. Seit der WEG-Reform im Dezember 2020 gibt es wegen der Umformulierung des Gesetzes anknüpfungspunkte, dass für die Bestellung eines Nichteigentümers keine BEschlusskompetenz besteht und damit ein solcher Beschluss nichtig ist. Hier ist die Entwicklung der Rechtssprechung abzuwarten.
Nicht zum Beirat gewählt werden kann ein Eigentümer, der gleichzeitig Verwalter ist. Auch der Geschäftsführer der Gesellschaft, welche die Verwaltung inne hat, kann nicht gewählt werden. An dieser Stelle soll und darf es wegen der Kontrollfunktion des Beirats keine Überschneidungen geben. Welche Auswirkungen ein entsprechender Beschluss hat, Nichtigkeit oder lediglich Anfechtbarkeit, ist ungeklärt.
Qualifikation des Verwaltungsbeirats
Das Gesetz schreibt keinerlei Qualifikation oder Ausbildung vor. Jedes Mitglied kann Beirat werden.
Wird ein Eigentümer gewählt, bei dem das Vertrauensverhältnis von vornherein ausgeschlossen erscheint, ist der Beschluss anfechtbar und entspricht nicht ordnungsgemäßer Verwaltung. Wird eine solche Tatsache bekannt, kann dies einen wichtigen Grund zur sofortigen Abwahl begründen. Die WEG-Verwaltung hat hier aber, wie beim WEG-Verwalter, ein erhebliches Ermessen, sodass ein Beschluss nur in Ausnahmefällen anfechtbar ist.
Fraglich ist, welche Anforderungen an die Person des Beirates zu stellen sind. Nach einer vertretenen Ansicht (OLG Köln, NJW –RR 2000,88) sind nicht die gleichen Anforderungen wie an einen Verwalter zu stellen, da dem Beirat nur eine Funktion ergänzender Art zukommt. Er hat grundsätzlich keine Entscheidungsbefugnis. Nach weiter vertretener Ansicht soll nur dann die Wahl nicht ordnungsgemäßer Verwaltung entsprechen, wenn schwerwiegende Umstände gegen die Person des Gewählten sprechen. Dies sind insbesondere Vorstrafen aus dem Bereich der Vermögensstraftaten. Nicht ausreichend soll es sein, wenn als Rechtsanwalt gegen einzelne Eigentümer vorgegangen wird, oder wenn er Streit mit einem anderen Wohnungseigentümer hat (auch ein Rechtsstreit reicht nicht aus) oder wenn er Verkaufsabsichten hat.
 Die Zusammensetzung des WEG-Beirats – Anzahl der Mitglieder
Gemäß § 29 WEG besteht der Beirat aus mindestens 1 Person. Die Versammlung kann den Vorsitzenden per Beschluss wählen. Es kann aber auch dem gewählten Beiräten überlassen werden, wen diese aus ihrer Mitte zum Vorsitzenden wählen.
In der Gemeinschaftsordnung kann eine abweichende Regelung getroffen sein, d.h. es können mehr Mitglieder, aber auch weniger Mitglieder vorgeschrieben sein.  Solche Regelungen sind im Zweifel nach der WEG-Reform nunmehr unwirksam, wenn sich nichts anderes aus der Teilungserklärung ergibt. Zweckmäßig ist eine ungerade Zahl, um eine Beschlussmehrheit in der Beiratssitzung zu ermöglichen. Dies kann je nach Größe der WEG auch sinnvoll sein.
Nach einer vertretenen Ansicht löst sich der Beirat nicht automatisch auf, wenn ein Beirat ausscheidet (OLG Düsseldorf). Entweder die Gemeinschaft hat für diesen Fall bereits einen Nachrücker gewählt oder sie ist gehalten ein neues Beiratsmitglied zu wählen.
Innere Organisation der Beiratsmitglieder
Das Gesetz weist dem Vorsitzenden zusätzlich zu den grundsätzlichen Beiratsaufgaben noch die Aufgaben der Unterzeichnung des Versammlungsprotokolls sowie der Vertretung der Gemeinschaft gegenüber dem WEG-Verwalter zu und unter bestimmten Voraussetzungen die Einberufung einer Versammlung . Zulässig ist auch eine Regelung, dass sich die Mitglieder abwechseln.
Der Vorsitzende beruft den Beirat gemäß §29 WEG nach Bedarf ein.
Aufgrund der gesetzlichen Funktion des Vorsitzenden, ist insoweit auch eine Vertreterbenennung notwendig. Für die Einberufung gelten die Vorschriften zur Eigentümerversammlung entsprechend (§ 24 WEG).
Verwalter und Eigentümer haben keinen Anspruch auf Teilnahme an den Sitzungen.
Die Beschlüsse des Verwaltungsbeirates werden mit einfacher Mehrheit gefasst. Die Beschlüsse des Beirats haben jedoch keine Bindungswirkung für die Gemeinschaft.
Eine Niederschrift ist nicht gesetzlich vorgeschrieben, bietet sich aber insbesondere bei der Beschlussfassung über die Empfehlung an die Eigentümer zur Beschlussfassung über die Jahresabrechnung an.
Rechte und Pflichten bei der Amtsausübung
Auskünfte und Unterlagen
Gemäß § 666 BGB ist der Beirat den Eigentümern zur Auskunft verpflichtet und zwar über den Inhalt seiner Tätigkeit.
Anders als der Verwalter muss der Beirat aber nicht einzelnen Wohnungseigentümern außerhalb der Versammlung  Auskunft erteilen, sondern nur der Wohnungseigentümergemeinschaft als solche. Die Eigentümergemeinschaft kann einen einzelnen Eigentümer per Beschluss ermächtigen die Auskünfte einzuholen.
Etwas anderes kann sich nur aus einer besonderen Vereinbarung ergeben oder im Einzelfall nach Treu und Glauben.
Nach Beendigung seiner Tätigkeit kann das Mitglied des Verwaltungsbeirates zur Herausgabe von Akten und sonstigen Unterlagen verpflichtet sein, § 667 BGB.
Erstattung von Aufwendungen des Verwalters
Gemäß § 670 BGB sind dem Beirat  Aufwendungen aus seiner Tätigkeit zu erstatten. Es handelt sich wohl zunächst um ein unentgeltliches Auftragsverhältnis
Dazu gehören zum Beispiel entstandene Kosten für Telefon, Kopierkosten, Briefmarken, aber auch Kosten für die Durchführung der Beiratssitzung (z.B.: Getränke). In einer größeren Wohnanlage gehören dazu auch die entstandenen Kosten für die Teilnahme an einem Seminar und die Anschaffung eines Fachbuches (kritisch Abramenko in KK- WEG §29 WEG, Rz.15).
Solche Aufwendungen müssen  erforderlich sein, wobei das Beiratsmitglied davon ausgehen kann,  wenn es sich um zweckmäßige Aufwendungen handelt. Entsprechen die Aufwendungen ordnungsgemäßer Verwaltung,  bedarf es keines gesonderten Beschlusses. Für den Aufwendungsersatz, der zu den Verwaltungskosten zählt, haftet die WEgem.
Hat sich ein ehrenamtlich tätiges Beiratsmitglied ggü. einem Dritten oder einem anderen Wohnungseigentümer schadensersatzpflichtig gemacht, ohne dass ihm grobe Fahrlässigkeit zur Last fällt, so kommt ein Freistellungsanspruch gem. § 670 BGB gegen die Wohnungseigentümergemeinschaft in Betracht.
Vereinbart werden kann auch ein jährlicher pauschaler Erstattungsanspruch (KG Berlin v. 29.03.2004-24 W 194/02, ZMR 2004,458; LG Hannover, ZMR, 398 (399); zu 3.579,04 EUR für drei Beiratsmitglieder bei 340 Einheiten), womit dann aber sämtliche Aufwendungen als abgegolten gelten.
Es kann auch eine Vergütung vereinbart werden. Bei dem Beschluss über die Höhe der Vergütung sind die Beiratsmitglieder nicht stimmberechtigt (§25 Abs. 5 WEG).
Haftpflichtversicherung des Verwaltungsbeirats
Zur Begrenzung des Haftungsrisikos des Verwaltungsbeirats kann eine Vermögensschadenshaftpflichtversicherung abgeschlossen werden. Diese übernimmt je nach Versicherungsvertrag die Absicherung für die gesetzlichen oder vertraglich übernommen Aufgaben. Die Versicherung kann durch die Eigentümergemeinschaft oder den Beirat selbst abgeschlossen werden. Ein solcher Beschluss entspricht idR ordnungsgemäßer Verwaltung, weil ein evtl. Schaden zumindest in Höhe der Versicherungssumme ersetzt wird, obwohl die WEG die Abwehr ihrer eigenen Ansprüche finanziert. Der Verwaltungsbeirat kann auch in die Vermögensschadenhaftpflichtversicherung des Verwalters mit einbezogen und über diesen versichert sein.
Sollte Ihre Verwaltung nicht bereits eine Beiratsversicherung anbieten, empfehlen wir Ihnen unseren Kooperationspartner finanzchecks.de. Vergleichen Sie direkt online die Vermögensschadenhaftpflicht für Verwaltungsbeiräte nach § 29 WEG.
Aufgaben und Befugnisse im Rahmen des Beiratsamtes
Unterstützung und Überwachung des Verwalters
Nach dem Gesetz stehen dem Beirat keine eigenen Befugnisse zu. Er ist ein Organ zur Unterstützung und Überwachung der Tätigkeit des Verwalters und der Vorbereitung der Versammlung. Eine genaue Beschreibung seiner Tätigkeit gibt das Gesetz nicht her, so dass der Umfang von Fall zu Fall sehr unterschiedlich ausfallen wird.
Im Rahmen dieser Unterstützungstätigkeit hat der Beirat das Recht den Verwalter zu beraten und im Einzelfall zwischen ihm und der Gemeinschaft zu vermitteln. Der Beirat hat das Recht, nicht aber die Pflicht sämtliche Aufgaben und Tätigkeiten des Verwalters zu überwachen und Auskunft zu verlangen.
Er soll gemäß §29 Abs.3 WEG insbesondere den Wirtschaftsplan, die Jahresabrechnung prüfen und mit einer Stellungnahme versehen, bevor die Gemeinschaft in der Versammlung darüber beschließt.
Die Tätigkeit hat unterstützende und überwachende Funktion. Es besteht weder Weisungsbefugnis gegenüber dem Verwalter, noch hat der Beirat eine rechtsgeschäftliche Vertretungsmacht für die Eigentümer. Lediglich gegenüber dem WEG-Verwalter besteht zur Unterzeichnung des Vertrages, zur Abgabe von Willenserklärungen eine beschränkte Vertretungsmacht der WEG-Gemeinschaft durch den Beirat.
Er kann daher nicht vom Verwalter verlangen, die Jahresabrechnung oder den Wirtschaftsplan zu ändern. Oftmals entwickelt sich hier aber eine Eigendynamik, wobei der Beirat mit dem Verwalter die Abrechnungen erstellt und der Verwalter die Weisungen und Änderungen des Beirats entgegennimmt. Dies ist jedoch unzulässig, soweit die Änderungen nicht für eine ordnungsgemäße Abrechnung notwendig sind.
Der Beirat kann dem Verwalter keine Befugnisse übertragen. Aufgrund der Vertretungsmacht könnte der Beiratsvorsitzende eigenmächtig den Verwalter- Vertrag ändern, erweitern oder gar kündigen. Dies würde aber, falls dies nicht von der Mehrheit der Eigentümer gewünscht wird zu einer Haftung führen. Hintergrund ist die in § 9b geregelte Vertretungsmacht des Beiratsvorsitzenden gegenüber dem WEG-Verwalter.
Er darf nur das, was die Eigentümer beschlossen haben und auch dort gilt, dass es nicht ordnungsgemäßer Verwaltung entspricht, wenn dem Beirat zu weitgehende Entscheidungsbefugnisse eingeräumt werden und damit Kompetenzen verlagert werden. Dies gilt insbesondere für die Freigabe von Sanierungs- und Bauaufträgen des Verwalters. Hier macht sich der Verwaltunsbeirat ggf. haftbar. Auch der Verwalter handelt in einem solchen Fall pflichtwidrig.
Erstrecht übernimmt der Beirat keine dem Verwalter obliegenden Aufgaben.
Beispiel unzulässiger Maßnahmen: Ohne Beschluss der Eigentümergemeinschaft wird ein vom Verwalter vorgelegtes Kostenangebot zur Instandsetzung mit einem Kostenvolumen von 30.000 € vom Beirat genehmigt und dann vom WEG-Verwalter beauftragt. Kleinere Kosten können vom WEG-Verwalter nunmehr ggf. auch allein ausgelöst werden, wenn diese nicht wesentlich sind. Es sollte hier dringend durch Beschlüsse reagiert werden, welche die Möglichkeiten des WEG-Verwalters einschränkt.
Prüfungsaufgaben gemäß § 29 Abs. 2 WEG
Jahresabrechnung und Wirtschaftsplan:
Im Rahmen seiner Prüfungspflicht hat der Beirat keinen Anspruch darauf, dass ihm die Originalunterlagen überlassen werden. Die Überprüfung der Abrechnungsunterlagen wird daher zumeist in den Räumen des Verwalters stattfinden. Mit dem Verwalter kann einvernehmlich etwas anderes vereinbart werden. Es ist jedoch zu beachten, dass ein Abhandenkommen der Unterlagen ggf. zur Haftung führt.
Inhaltlich muss der Beirat zunächst die Schlüssigkeit der Jahresabrechnung / Wirtschaftsplanes prüfen. Insoweit muss er zunächst die rechnerische Nachvollziehbarkeit überprüfen. Dazu muss er den erforderlichen Inhalt einer solchen Abrechungen kennen und wissen, welche Mindestanforderungen an diese Abrechnung zu stellen sind.
•	es müssen die tatsächlichen Einnahmen (insbesondere die Wohngeldzahlungen) und Ausgaben enthalten sein, einschließlich der Heizkosten und Warmwasserabrechnung
•	es muss der richtige Verteilungsschlüssel angegeben worden sein
•	die Entwicklung der Instandhaltungsrücklage muss dargestellt sein
•	es müssen die Kontostände zum 1.1. und zum 31.12. angegeben sein (Status)
Sind diese Angaben enthalten so muss das Saldo zwischen den dargestellten Einnahmen und Ausgaben dem Saldo der Kontostände zum 1.1. und 31.12. entsprechen. Die Jahresabrechnung ist eine reine Einnahmen und Ausgabenrechnung für diesen Zeitraum. Einzig Kosten für Heizung und Warmwasser dürfen in der Abrechnung berücksichtigt werden, auch wenn diese Kosten nicht vollumfänglich in diesem Zeitraum beglichen wurden, sondern erst im Folgejahr. Dies hängt damit zusammen, dass die Heizkostenverordnung zwingend auch für die Wohnungseigentümergemeinschaft gilt (§3 HeizKVO). Die Heizkostenverordnung schreibt eine Verbrauchsabhängige Abrechnung vor.
Sodann hat er die Kontoauszüge zu prüfen. Er hat insoweit zu prüfen, ob Ausgaben und Einnahmen aus der Abrechnung sich dort wiederfinden. Umgekehrt auch, ob alle Ausgaben und Einnahmen, die sich aus den Kontobelegen ergeben, sich in der Abrechnung wiederfinden und die Angaben der Kontostände übereinstimmen. Bei der Feststellung von Unregelmäßigkeiten ist der Beirat verpflichtet hierauf hinzuweisen und dem Nachzugehen.
Auch hat er die erfolgten Zahlungen mit den dazu vorliegenden Rechnungsbelegen jedenfalls stichprobenartig zu prüfen.
Es steht im Ermessen des Beirates, ob er sämtliche Kontoauszüge und Belege prüft oder ob er nur Stichproben vornimmt. Wenn er sich dafür entscheidet nur Stichproben vorzunehmen so hat er jedenfalls die Überweisung von größeren und auffälligen Beträgen zu prüfen. Stellen sich bei der Prüfung Unregelmäßigkeiten heraus, so verpflichtet dies zu genaueren Ermittlungen.
Die Stellungnahme gegenüber den Eigentümern kann schriftlich erfolgen oder auch mündlich in der Eigentümerversammlung abgegeben werden. Es empfiehlt sich aus haftungsrechtlichen Gründen dies schriftlich zu tun. M.E. nach ist es sinnvoll hierbei immer genau anzugeben wie weit die Prüfung der Unterlagen gegangen ist. Insbesondere, dass im Hinblick auf bestimmte Unterlagen eben nur Stichproben vorgenommen wurden.
Die Eigentümer haben keinen rechtlich durchsetzbaren Anspruch auf einen Prüfbericht und auf Durchführung dieser Aufgaben. Soweit die Eigentümer mit der Tätigkeit des Beirates nicht zufrieden sind, so bleibt die Möglichkeit der Abberufung. Wird eine Prüfung durchgeführt, muss diese jedoch korrekt erfolgen, weil sich die Eigentümer darauf verlassen.
Prüfung von Kostenanschlägen
Aufgabe des Beirats in diesem Zusammenhang ist es nicht mehr ohne weiteres zu prüfen, ob die zu erwartende Ausgabe für die geplante Maßnahme gerechtfertigt ist, ob sie rechnerisch richtig ist und ob das Angebot vollständig ist. Im Rahmen der Überwachungspflicht kann sich dies jedoch bei größeren Maßnahmen im Einzelfall ergeben. Siehe oben zur WEG-Reform. Erfolgt eine Prüfung sollte sie korrekt und vollständig sein.
Im Ergebnis wird auch nur ein Beschluss der Eigentümer vorbereit. Insofern sollte im Zweifel die Beiziehung eines Fachmanns von der Gemeinschaft beschlossen werden, damit Schäden von der Gemeinschaft, insbesondere bei größeren Instandsetzungsmaßnahmen durch eine clevere Bauausführung vermieden werden kann.
 Unterschreiben der Protokollniederschrift
Es besteht keine Vorschrift darüber, wer die Versammlungsniederschrift zu erstellen hat. Ihre rechtliche Bedeutung erlangt die Versammlungsniederschrift erst durch die Unterschriften. Die Niederschrift ist gemäß §24 Abs.6 WEG zu unterschreiben vom Vorsitzenden der Versammlung, von einem Eigentümer und dem Beiratsvorsitzendem.
Wird die Unterschrift verweigert, so sind die gefassten Beschlüsse gültig. Lediglich der Beweiswert der Niederschrift wird geschmälert.
Verwalterbestellung und Abschluss des Verwaltervertrages
Anders als vor der WEG-Reform ist der Verwaltungsbeiratsvorsitzende zur Unterzeichung des WEG-Verwaltervertrages nach § 9b WEG n.F. berechtigt.
Einberufung einer Versammlung
Nicht zu unterschätzenden ist die Möglichkeit durch den Beiratsvorsitzenden eine Eigentümerversammlung einzuberufen, wenn diese durch den Verwalter nicht einberufen wird (§24 Abs.3 WEG). Fehlt dann ein Beirat kann ein einzelner Eigentümer oder auch eine Gruppe von Eigentümern keine Versammlung einberufen. Diese müssten dann erst den Weg über das Gericht suchen.
Übertragung besonderer Aufgaben
Per Mehrheitsbeschluss können dem Beirat noch mehr Aufgaben übertragen werden.
Innerhalb gewisser Grenzen können durch Vereinbarung gesetzliche Regelungen erweitert oder beschränkt werden.
Insbesondere kann dem Verwaltungsbeirat aufgegeben werden, auch die laufende Tätigkeit des Verwalters zu überwachen.
So kann zum Beispiel dem Beirat übertragen werden, im Benehmen mit dem Verwalter einen Sanierungsauftrag zu vergeben.
Die Veräußerungszustimmung gemäß § 12 Abs.2 WEG kann dem Beirat oder auch nur dem Vorsitzendem übertragen werden.
Möglich ist wohl ferner auch die Bevollmächtigung zur Abnahme des gemeinschaftlichen Eigentums (BGH, 15.4.2004) bei Beendigung eines Bauvorhabens.  Allerdings dürfte ein durchschnittlicher Beirat damit regelmäßig überfordert sein, hinzu kommt ein nicht geringes Haftungsrisiko. Davon zu unterscheiden ist die Abnahme des gemeinschaftlichen Eigentums beim Kauf vom Bauträger.
Der Übertragung von Befugnissen an den Verwaltungsbeirat sind durch die zwingenden Vorschriften des Wohnungseigentumsgesetzes enge Grenzen gesetzt.
27 Abs. 4 WEG regelt, dass die Aufgaben gemäß §27 Abs.1 bis 3 WEG uneinschränkbar sind. Die dort geregelten Aufgaben können daher in keinem Falle dem Beirat übertragen werden.
Andere Verwaltungsaufgaben liegen zwingend bei der Eigentümerversammlung.
Daher kann dem Beirat nie per Mehrheitsbeschluss generell die Entscheidung über Sanierungsbeschlüsse, über den Abschluss von Verwalterverträgen oder zur endgültigen Entlastung des Verwalters und Billigung der Jahresabrechnung übertragen werden.
Dies darf nur im Einzelfall und in sehr engen Grenzen geschehen. Das Wesentliche muss im Beschluss stehen und von der Eigentümerversammlung beschlossen werden. Zum Beispiel muss bei der Auswahl von verschiedenen Angeboten ein genauer Kostenrahmen vorgegeben werden, wenn diese Aufgabe der Beirat übernehmen soll (KG v.10.3.2003- 24 W 141/02, ZMR 2004,623).
Nach vorherrschender Ansicht soll es möglich sein dem Verwaltungsbeirat per Vereinbarung den „Beschluss“ über die Genehmigung der Jahresabrechnung zu übertragen. Dies kann jedoch keine generelle Aufgabenübertragung sein, sondern nur für den Einzelfall. Der genehmigende Beschluss des Beirats kann dann nicht mehr angefochten werden, denn es handelt sich nicht um einen Beschluss. Die Einräumung dieser Kompetenz im Einzelfall kann nicht durch Mehrheitsbeschluss erfolgen, ein solcher wäre mangels Beschlusskompetenz nichtig.
Schlichtungsstelle
Die Gemeinschaftsordnung oder eine Vereinbarung kann regeln, dass dem Verwaltungsbeirat die Aufgabe einer Schlichtungsstelle zukommt. Diese Regelung kann zum Inhalt haben, dass vor Einleitung eines Verfahrens gemäß §43 WEG der Verwaltungsbeirat als Schlichtungsstelle angerufen werden muss.



Haftung des Verwaltungsbeirats für Pflichtverletzungen
Allgemeines
Die Nichterfüllung oder Schlechterfüllung seiner Pflichten kann für den Verwaltungsbeirat Schadensersatzansprüche auslösen. Da die Gemeinschaft mit den einzelnen Beiratsmitgliedern  ein sogenanntes Auftrags- bzw. Geschäftsbesorgungsverhältnis hat (§§ 662 ff. BGB, §§ 675,611 BGB (bei entgeltlicher Tätigkeit), richtet sich die Haftung nach §280 BGB. Ob eine Pflichtverletzung vorliegt oder nicht richtet sich nach den jeweils bestehenden Verpflichtungen des Beirats. Das Auftragsverhältnis kann allein die gesetzlichen Verpflichtungen umfassen (§ 29 WEG) oder aber auch je nach vertraglicher Vereinbarung darüber hinaus gehen.
Da jedes einzelne Beiratsmitglied ein vertragliches Verhältnis mit der Gemeinschaft hat, entsteht eine gesamtschuldnerische Haftung (§421 BGB). Jedes Beiratsmitglied haftet aufs Ganze und kann einzeln von der Gemeinschaft auf die volle Summe in Anspruch genommen werden. Im Innenverhältnis besteht ein Ausgleichsanspruch.
Voraussetzung für jede Haftung ist jedoch stets ein kausal verursachter Schaden. Zwischen dem Handeln oder dem pflichtwidrigen Unterlassen des Beirates und dem Vermögensschaden der Wohnungseigentümergemeinschaft muss ein ursächlicher Zusammenhang, in der Form, dass bei pflichtgemäßem Verhalten des Beirates der Schaden nicht entstanden wäre.
Denkbar ist weiterhin die Haftung aus vollmachtloser Vertretung (§§177,179 BGB), aus angemaßter Eigengeschäftsführung und aus unerlaubter Handlung.
Haftungsmaßstab
Maßstab ist grundsätzlich §276 BGB: die im Geschäftsverkehr erforderliche Sorgfalt. Anmerkung: dies ist etwas anderes als die übliche Sorgfalt.
Die Haftung ist  grundsätzlich nicht auf Vorsatz oder grobe Fahrlässigkeit beschränkt. Dies gilt nach der WEG-Reform nur, wenn der Beirat unentgeltlicht tätig wird. Eine genauere Darstellung erfolgte oben bei der WEG-Reform.
Eine Schadenersatzpflicht entsteht zum Beispiel, wenn der Beirat entgegen der Beschlussfassung der Gemeinschaft beim Aushandeln des Verwaltervertrages dem Verwalter uneingeschränkte Verfügungsmacht über die Instandhaltungsrücklage zubilligt. Ferner auch dann, wenn bei der Prüfung der Jahresabrechnung auf die Einsicht in die Belege verzichtet wird (OLG Düsseldorf, 24.09.1997, 3 Wx 221/97, zur Verurteilung eines Beirates auf Schadenersatz in Höhe von 100.000,00 EUR).
Verletzt ein Beirat schuldhaft seine Pflichten und kommt damit Dritten gegenüber in die Haftung, so haftet die Eigentümergemeinschaft dem Dritten gegenüber aus § 278 BGB wie für eine eigene Pflichtverletzung. Haftet der Beirat aus Delikt, so findet §831 BGB Anwendung, nicht aber §31 BGB.
Kommt der Beirat seinen Kontrollpflichten überhaupt nicht oder nur unzureichend nach und wird der Verwalter darauf hin entlastet, so muss sich die Wohnungseigentümergemeinschaft das Wissen des Beirats gemäß §166 BGB voll zurechnen lassen. Etwas anderes ist die Frage der Haftung im Innenverhältnis.
Versicherung
Der Abschluss einer Versicherung für den Beirat auf Kosten der Gemeinschaft kann beschlossen werden und ist empfehlenswert. Ein solcher Beschluss entspricht ordnungsgemäßer Verwaltung (KG v. 19.07.2004, 24 W 203/02). Dabei ist zu berücksichtigen, dass die Versicherungen nur fahrlässig verursachte Schäden erstatten und bei Vorsatz nicht einstehen. Auch die Verwalterhaftpflichtversicherungen bieten teilweise eine Einbeziehung des Beirates an.
Die Entlastung des Verwaltungsbeirates
Die Entlastung des Beirates ist der Sache nach das gleiche wie die Entlastung des Verwalters. Die Gemeinschaft verzichtet damit auf Schadensersatzansprüche, die im Zeitpunkt der Entlastung entstanden und erkennbar waren.
Der Entlastungsbeschluss entspricht nicht ordnungsgemäßer Verwaltung und ist daher anfechtbar, wenn der Verwaltungsbeirat die Annahme einer nicht übersichtlichen oder unvollständigen Abrechnung empfiehlt.
Schadenersatzansprüche gegen den Beirat verjähren übrigens im Rahmen der regelmäßigen Verjährungsfrist
Hat sich ein Verwaltungsbeiratsmitglied gegenüber einem Dritten haftbar gemacht, so steht ihm gegen über der Gemeinschaft ein Freistellungsanspruch zu, sofern er nicht grob Fahrlässig gehandelt hat (BGH v.5.12.1983- II ZR 252/82, BGHZ 89,153).
Wissenszurechnung durch Beiratskenntnis
Das Kammergericht Berlin hat mit Beschluss vom 31. März 2009 – 24 W 183/07 –, juris entschieden, dass eine Kenntnis des Verwaltungsbeirats unter Umständen den übrigen Eigentümern zugerechnet werden kann. Dies ist insbesondere für die Geltendmachung von Schadenersatzansprüche oder der Kündigung des Verwaltervertrages aus wichtigem Grund relevant. Sollte wegen eine mangelnden Aufklärung der übrigen Eigentümer durch den Verwaltungsbeirat ein Schaden der WEG entstehen, besteht hier eine Ersatzpflicht. Das Kammergericht begründet diese Rechtsansicht wie folgt:
Nach § 29 Abs. 3 WEG ist es u.a. Aufgabe des Verwaltungsbeirats, die Rechnungs- und Belegprüfung des Wohnungseigentumsverwalters durchzuführen und mit einer Stellungnahme zu versehen. Diese Tätigkeit schließt ein, die Wohnungseigentümergemeinschaft in angemessener Zeit zu informieren, wenn ihm bei Prüfung der vom Verwalter vorgelegten Unterlagen Tatsachen bekannt werden, die eine Abberufung des Verwalters und eine Kündigung des Verwaltervertrages rechtfertigen könnten. Er kann dazu die Einberufung einer außerordentlichen Eigentümerversammlung veranlassen oder selber gemäß § 24 Abs. 3 WEG die Versammlung der Wohnungseigentümer einberufen, wenn der Verwalter fehlt oder sich pflichtwidrig weigert, die Versammlung einzuberufen. Aufgrund dieser organschaftlichen Befugnisse des Verwaltungsbeirats erscheint es angemessen, die Antragsgegner so zu behandeln, als ob die Wohnungseigentümergemeinschaft informiert gewesen wäre, sofern der Verwaltungsbeirat diese nicht in angemessener Zeit einberufen hat, nachdem er selbst Kenntnis erlangt hat (so für die Kenntnis der Generalversammlung einer Genossenschaft bei entsprechender Kenntnis des Aufsichtsrats BGH NJW 1984, 2689-2690 und BGH NJW-RR 2007, 690-692 und für die Wissenszurechnung eines Mitglieds des für die Kündigung zuständigen Organs BGH, Urt.v. 05.04.1990, Az.: IX ZR 16/89, dokumentiert bei juris). Dem Verwaltungsbeirat steht aber eine Überlegungsfrist zu. Diese vorliegend nach Auffassung des Senats nicht überschritten, so dass es im Ergebnis bei der vom Landgericht getroffenen Einschätzung bleibt.
---
Anforderungen Kassenprüfungsbericht der WEG Silberbach, Baden-Baden

Das Wohnungseigentumsgesetz (WEG), das im Dezember 2020 in Deutschland umfassend reformiert wurde, regelt unter anderem die Buchprüfung und die Erstellung eines Vermögensberichts in Wohnungseigentümergemeinschaften. Die wesentlichen Punkte bezüglich Buchprüfung und Vermögensbericht sowie die Aufgaben der Hausverwaltung und des WEG-Beirats sind wie folgt:

Buchprüfung und Vermögensbericht:
Hausverwaltung (Verwalter): Die Hausverwaltung ist verpflichtet, eine ordnungsgemäße Buchführung zu führen. Sie muss alle Einnahmen und Ausgaben der WEG transparent und nachvollziehbar dokumentieren. Darüber hinaus ist die Hausverwaltung verantwortlich für die Erstellung eines jährlichen Wirtschaftsplans sowie eines Vermögensberichts, der die finanzielle Situation der WEG darlegt. Der Vermögensbericht muss Informationen über das Gemeinschaftsvermögen, Rücklagen, Verbindlichkeiten und Forderungen enthalten.
WEG-Beirat: Der Beirat, oft auch Verwaltungsbeirat genannt, hat eine Kontrollfunktion. Er soll die Tätigkeit der Hausverwaltung überwachen und unterstützen. Bezogen auf die Buchprüfung und den Vermögensbericht hat der Beirat insbesondere die Aufgabe, die von der Verwaltung vorgelegten Unterlagen, also die Jahresabrechnung und den Vermögensbericht, vor der Eigentümerversammlung zu prüfen. Er kann Empfehlungen aussprechen und auf eventuelle Unstimmigkeiten hinweisen.

Pflichten und Verfahren:
1. Erstellung und Prüfung: Die Hausverwaltung erstellt den Vermögensbericht und die Jahresabrechnung und legt diese dem Beirat zur Prüfung vor.
2. Transparenz und Informationspflicht: Die Unterlagen müssen den Eigentümern rechtzeitig vor der Eigentümerversammlung zur Verfügung gestellt werden, sodass eine angemessene Überprüfung möglich ist.
3. Eigentümerversammlung: In der jährlichen Eigentümerversammlung werden der Vermögensbericht und die Jahresabrechnung vorgestellt. Die Eigentümer haben die Möglichkeit, Fragen zu stellen und Erläuterungen zu fordern. Am Ende wird über die Abnahme der Jahresabrechnung und die Entlastung der Verwaltung abgestimmt.

Fristen für Buchprüfung und Vermögensbericht in der WEG Silberbach
1.	Erstellung des Vermögensberichts und der Jahresabrechnung durch die Hausverwaltung. Frist: Spätestens bis zum 31. März des Folgejahres
Der Verwalter ist verpflichtet, die Jahresabrechnung und den Vermögensbericht für das vergangene Wirtschaftsjahr bis spätestens zum 31. März des Folgejahres zu erstellen und dem Verwaltungsbeirat zur Prüfung vorzulegen.
2.	Prüfung durch den Verwaltungsbeirat. Frist: Innerhalb von 4 Wochen nach Erhalt der Unterlagen (spätestens bis zum 30. April) Der Verwaltungsbeirat prüft die Unterlagen, nimmt Einsicht in die Belege und Bankauszüge und erstellt eine schriftliche Stellungnahme zur Jahresabrechnung und zum Vermögensbericht.
3.	Bereitstellung der geprüften Unterlagen an die Eigentümer Frist: Mindestens 3 Wochen vor der Eigentümerversammlung Die geprüfte Jahresabrechnung und der Vermögensbericht müssen mindestens 3 Wochen vor der Eigentümerversammlung den Eigentümern zur Verfügung gestellt werden (§ 24 Abs. 4 WEG).
4.	Eigentümerversammlung und Beschlussfassung Frist: Spätestens bis zum 30. Juni des Folgejahres. In der Eigentümerversammlung wird die Jahresabrechnung geprüft, diskutiert und über ihre Genehmigung und die Entlastung der Verwaltung abgestimmt.
5.	Einspruchsfrist für Eigentümer gegen die Abrechnung. Frist: 1 Monat nach Beschlussfassung. Eigentümer haben das Recht, binnen eines Monats nach Beschlussfassung Einwände gegen die Jahresabrechnung oder den Vermögensbericht zu erheben (§ 46 WEG – Anfechtungsklage).

Zusätzlicher Hinweis zur Fristwahrung
Falls die Fristen durch unvorhergesehene Ereignisse (z. B. fehlende Buchungsunterlagen oder Verzögerungen bei der Hausverwaltung) nicht eingehalten werden können, ist der Verwaltungsbeirat verpflichtet, die Eigentümergemeinschaft spätestens zwei Wochen vor der geplanten Eigentümerversammlung über die Verzögerung zu informieren und einen neuen Zeitplan festzulegen.

Die Reform des WEG-Gesetzes zielt darauf ab, die Verwaltung von Wohnungseigentum moderner, effizienter und transparenter zu gestalten. Die klare Regelung der Aufgaben und Verantwortlichkeiten von Verwaltung und Beirat trägt dazu bei, die Interessen der Eigentümer zu schützen und das Zusammenleben in der WEG zu verbessern.
---`,
      });
      return { answer: text };
    }
  );
  return chatWithBoardAssistantFlow(input);
}

    