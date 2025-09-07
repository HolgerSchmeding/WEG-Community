'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Save,
  Timer,
  Edit3,
} from 'lucide-react';
import {
  LiveProtocolSession,
  LiveProtocolItem,
  VotingResult,
  DecisionResult,
} from '@/lib/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface LiveProtocolSessionProps {
  session: LiveProtocolSession;
  onUpdateSession: (session: LiveProtocolSession) => void;
}

export function LiveProtocolSessionComponent({
  session,
  onUpdateSession,
}: LiveProtocolSessionProps) {
  const [discussionInput, setDiscussionInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [votingInput, setVotingInput] = useState({
    votesFor: '',
    votesAgainst: '',
    abstentions: '',
  });
  const [decisionInput, setDecisionInput] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [currentVotersInput, setCurrentVotersInput] = useState('');
  const [isEditingVoters, setIsEditingVoters] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  const discussionRef = useRef<HTMLTextAreaElement>(null);

  const currentItem = session.items[session.currentTopIndex];
  const currentVoters = currentItem.currentVoters || session.totalVoters;

  // Automatische Validierung der Abstimmung
  const validateVoting = (
    votesFor: number,
    votesAgainst: number,
    abstentions: number,
    totalVoters: number
  ): boolean => {
    const total = votesFor + votesAgainst + abstentions;
    return total === totalVoters;
  };

  const handleStatusChange = (
    newStatus: 'Vorbereitung' | 'Laufend' | 'Pausiert' | 'Abgeschlossen'
  ) => {
    const updatedSession = {
      ...session,
      status: newStatus,
      startTime:
        newStatus === 'Laufend' && !session.startTime
          ? new Date()
          : session.startTime,
      endTime: newStatus === 'Abgeschlossen' ? new Date() : undefined,
    };
    onUpdateSession(updatedSession);
  };

  const handleNavigateTop = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'prev'
        ? Math.max(0, session.currentTopIndex - 1)
        : Math.min(session.items.length - 1, session.currentTopIndex + 1);

    const updatedSession = {
      ...session,
      currentTopIndex: newIndex,
    };
    onUpdateSession(updatedSession);

    // Reset input fields when switching TOPs
    const newCurrentItem = session.items[newIndex];
    setDiscussionInput(newCurrentItem.discussion || '');
    setKeywordsInput(newCurrentItem.keywords || '');
    setDecisionInput(newCurrentItem.decision || '');
    setCurrentVotersInput(
      (newCurrentItem.currentVoters || session.totalVoters).toString()
    );
    setVotingInput({
      votesFor: newCurrentItem.votingResult?.votesFor.toString() || '',
      votesAgainst: newCurrentItem.votingResult?.votesAgainst.toString() || '',
      abstentions: newCurrentItem.votingResult?.abstentions.toString() || '',
    });
  };

  const handleUpdateCurrentItem = (updates: Partial<LiveProtocolItem>) => {
    const updatedItems = session.items.map((item, index) =>
      index === session.currentTopIndex ? { ...item, ...updates } : item
    );

    const updatedSession = {
      ...session,
      items: updatedItems,
    };
    onUpdateSession(updatedSession);
  };

  const handleUpdateCurrentVoters = () => {
    const newVoters = parseInt(currentVotersInput);
    if (newVoters > 0) {
      handleUpdateCurrentItem({ currentVoters: newVoters });
      setIsEditingVoters(false);

      // Reset voting inputs wenn sich Stimmberechtigte ändern
      setVotingInput({
        votesFor: '',
        votesAgainst: '',
        abstentions: '',
      });
    }
  };

  const handleSaveVoting = () => {
    const votesFor = parseInt(votingInput.votesFor) || 0;
    const votesAgainst = parseInt(votingInput.votesAgainst) || 0;
    const abstentions = parseInt(votingInput.abstentions) || 0;

    const isValid = validateVoting(
      votesFor,
      votesAgainst,
      abstentions,
      currentVoters
    );

    const votingResult: VotingResult = {
      votesFor,
      votesAgainst,
      abstentions,
      totalVoters: currentVoters,
      isValid,
    };

    // Automatische Entscheidung basierend auf Abstimmung
    let decisionResult: DecisionResult = 'Keine Abstimmung';
    if (votesFor > votesAgainst) {
      decisionResult = 'Angenommen';
    } else if (votesAgainst > votesFor) {
      decisionResult = 'Abgelehnt';
    } else if (votesFor === votesAgainst && votesFor > 0) {
      decisionResult = 'Vertagt'; // Bei Gleichstand
    }

    handleUpdateCurrentItem({
      votingResult,
      decisionResult,
      decision: decisionInput,
      endTime: new Date(),
    });
  };

  const handleImproveWithAI = async () => {
    if (!keywordsInput.trim()) return;

    setIsImprovingText(true);
    try {
      const response = await fetch('/api/protocol/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywordsInput,
          context: currentItem.title,
          discussion: discussionInput,
        }),
      });

      if (response.ok) {
        const { improvedText } = await response.json();
        // Text direkt in das Beschluss-Feld einfügen
        setDecisionInput(improvedText);
        handleUpdateCurrentItem({ decision: improvedText });
      }
    } catch (error) {
      console.error('Fehler bei KI-Verbesserung:', error);
    } finally {
      setIsImprovingText(false);
    }
  };

  const handleGenerateAIText = async () => {
    if (!keywordsInput.trim()) return;

    setIsGeneratingAI(true);
    try {
      // Simuliere KI-Textgenerierung mit realen Inhalten
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sammle verfügbare Informationen
      const topTitle = currentItem.title;
      const topDescription = currentItem.description || '';
      const currentDiscussion = discussionInput.trim();
      const keywords = keywordsInput.trim();

      // Generiere intelligenten Text basierend auf Eingaben
      let discussionText = '';
      let beschlussText = '';

      if (currentDiscussion) {
        discussionText = `${currentDiscussion}\n\nZusätzlich wurden folgende Punkte besprochen: ${keywords}. Die Diskussion verlief konstruktiv und alle wesentlichen Aspekte wurden eingehend erörtert.`;
      } else {
        discussionText = `Zu "${topTitle}" wurde eine ausführliche Diskussion geführt. Schwerpunkte waren: ${keywords}. ${topDescription ? `Hintergrund: ${topDescription}` : ''} Alle Anwesenden konnten ihre Meinungen und Bedenken äußern.`;
      }

      if (currentItem.requiresVoting) {
        beschlussText = `Nach eingehender Beratung wird folgender Beschluss gefasst:\n\nBeschluss zu "${topTitle}":\nDie Versammlung beschließt bezüglich ${keywords.toLowerCase()}. ${topDescription ? `Grundlage: ${topDescription}` : ''}\n\nDieser Beschluss wird zur Abstimmung gestellt.`;
      } else {
        beschlussText = `Zu "${topTitle}" wird festgehalten:\n\n${keywords ? `Die besprochenen Punkte (${keywords}) werden zur Kenntnis genommen.` : 'Die Informationen werden zur Kenntnis genommen.'} ${topDescription ? `Hintergrund: ${topDescription}` : ''}\n\nKeine weitere Abstimmung erforderlich.`;
      }

      const generatedText = `Diskussion:\n${discussionText}\n\nBeschluss:\n${beschlussText}`;

      setAiGeneratedText(generatedText);
    } catch (error) {
      console.error('Fehler bei KI-Textgenerierung:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleUseAIText = () => {
    if (!aiGeneratedText) return;

    // Extrahiere Diskussion und Beschluss aus dem generierten Text
    const sections = aiGeneratedText.split('\n\nBeschluss:\n');

    if (sections.length >= 2) {
      const discussionSection = sections[0].replace('Diskussion:\n', '').trim();
      const beschlussSection = sections[1].trim();

      setDiscussionInput(discussionSection);
      setDecisionInput(beschlussSection);

      // Update das aktuelle Item
      handleUpdateCurrentItem({
        discussion: discussionSection,
        decision: beschlussSection,
      });
    }

    // Clear den AI Text nach Übernahme
    setAiGeneratedText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Laufend':
        return 'bg-green-500';
      case 'Pausiert':
        return 'bg-yellow-500';
      case 'Abgeschlossen':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const completedTopCount = session.items.filter(
    item => item.isCompleted
  ).length;
  const progress = (completedTopCount / session.items.length) * 100;

  React.useEffect(() => {
    // Initialize form fields when component mounts or TOP changes
    setDiscussionInput(currentItem.discussion || '');
    setKeywordsInput(currentItem.keywords || '');
    setDecisionInput(currentItem.decision || '');
    setCurrentVotersInput(currentVoters.toString());
    setVotingInput({
      votesFor: currentItem.votingResult?.votesFor.toString() || '',
      votesAgainst: currentItem.votingResult?.votesAgainst.toString() || '',
      abstentions: currentItem.votingResult?.abstentions.toString() || '',
    });
  }, [currentItem, currentVoters]);

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Live-Protokoll: {session.meetingTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(session.meetingDate, 'PPP', { locale: de })} •
                Versammlungsleiter: {session.chairperson} • Protokollführer:{' '}
                {session.secretary}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {session.totalVoters} anwesend (Start)
              </Badge>
              <Badge className={getStatusColor(session.status)}>
                {session.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Session Controls */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              onClick={() => handleStatusChange('Laufend')}
              variant={session.status === 'Laufend' ? 'default' : 'outline'}
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
            <Button
              onClick={() => handleStatusChange('Pausiert')}
              variant={session.status === 'Pausiert' ? 'default' : 'outline'}
              size="sm"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button
              onClick={() => handleStatusChange('Abgeschlossen')}
              variant="outline"
              size="sm"
            >
              <Square className="h-4 w-4 mr-1" />
              Beenden
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span>
                {completedTopCount} von {session.items.length} TOP abgeschlossen
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current TOP */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                TOP {currentItem.topNumber}: {currentItem.title}
              </CardTitle>
              {currentItem.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentItem.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleNavigateTop('prev')}
                disabled={session.currentTopIndex === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">
                {session.currentTopIndex + 1} von {session.items.length}
              </Badge>
              <Button
                onClick={() => handleNavigateTop('next')}
                disabled={session.currentTopIndex === session.items.length - 1}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Voters Management - Simplified */}
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                Stimmberechtigte für diesen TOP:
              </span>
            </div>
            {!isEditingVoters ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  {currentVoters}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingVoters(true)}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Ändern
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={currentVotersInput}
                  onChange={e => setCurrentVotersInput(e.target.value)}
                  className="w-20"
                  min="1"
                />
                <Button size="sm" onClick={handleUpdateCurrentVoters}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingVoters(false)}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>

          {/* Discussion Protocol */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Notizen & Diskussion
            </h4>
            <Textarea
              ref={discussionRef}
              value={discussionInput}
              onChange={e => setDiscussionInput(e.target.value)}
              onBlur={() =>
                handleUpdateCurrentItem({ discussion: discussionInput })
              }
              placeholder="Live-Notizen während der Diskussion eingeben..."
              className="min-h-32"
            />
          </div>

          {/* Stichworte für KI-Textgenerierung */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Stichworte für den Protokoll Text
              </h4>
              <Button
                onClick={handleGenerateAIText}
                disabled={!keywordsInput.trim() || isGeneratingAI}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {isGeneratingAI ? 'Generiere...' : 'KI-Text generieren'}
              </Button>
            </div>

            <Input
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              onBlur={() =>
                handleUpdateCurrentItem({ keywords: keywordsInput })
              }
              placeholder="z.B. Dachsanierung, 45.000€, einstimmig beschlossen..."
              className="w-full"
            />

            {/* KI-generierter Textvorschlag */}
            {aiGeneratedText && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-purple-700">
                    KI-Textvorschlag
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUseAIText}
                    className="text-white bg-purple-600 border-purple-300 hover:bg-purple-700 hover:text-white"
                  >
                    Text übernehmen
                  </Button>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <pre className="text-sm text-purple-800 whitespace-pre-wrap font-sans">
                    {aiGeneratedText}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Beschluss-Text */}
          <div className="space-y-3">
            <h4 className="font-semibold">Beschluss-Text</h4>
            <Textarea
              value={decisionInput}
              onChange={e => setDecisionInput(e.target.value)}
              onBlur={() =>
                handleUpdateCurrentItem({ decision: decisionInput })
              }
              placeholder="Beschluss-Text eingeben..."
              rows={3}
            />
          </div>

          {/* Voting Section - nur bei TOPs mit Abstimmung */}
          {currentItem.requiresVoting && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Abstimmung
              </h4>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <Label className="text-sm font-medium text-blue-600">
                    Stimmberechtigte
                  </Label>
                  <Input
                    type="number"
                    value={currentVoters}
                    disabled
                    className="bg-blue-50 font-medium"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-600">
                    Ja-Stimmen
                  </Label>
                  <Input
                    type="number"
                    value={votingInput.votesFor}
                    onChange={e =>
                      setVotingInput(prev => ({
                        ...prev,
                        votesFor: e.target.value,
                      }))
                    }
                    placeholder="0"
                    min="0"
                    max={currentVoters}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-red-600">
                    Nein-Stimmen
                  </Label>
                  <Input
                    type="number"
                    value={votingInput.votesAgainst}
                    onChange={e =>
                      setVotingInput(prev => ({
                        ...prev,
                        votesAgainst: e.target.value,
                      }))
                    }
                    placeholder="0"
                    min="0"
                    max={currentVoters}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Enthaltungen
                  </Label>
                  <Input
                    type="number"
                    value={votingInput.abstentions}
                    onChange={e =>
                      setVotingInput(prev => ({
                        ...prev,
                        abstentions: e.target.value,
                      }))
                    }
                    placeholder="0"
                    min="0"
                    max={currentVoters}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveVoting} className="w-full">
                    <Save className="h-4 w-4 mr-1" />
                    Speichern
                  </Button>
                </div>
              </div>

              {/* Validation Alert */}
              {votingInput.votesFor ||
              votingInput.votesAgainst ||
              votingInput.abstentions ? (
                <Alert
                  className={
                    validateVoting(
                      parseInt(votingInput.votesFor) || 0,
                      parseInt(votingInput.votesAgainst) || 0,
                      parseInt(votingInput.abstentions) || 0,
                      currentVoters
                    )
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {validateVoting(
                      parseInt(votingInput.votesFor) || 0,
                      parseInt(votingInput.votesAgainst) || 0,
                      parseInt(votingInput.abstentions) || 0,
                      currentVoters
                    ) ? (
                      <span className="text-green-700">
                        ✓ Stimmen korrekt:{' '}
                        {(parseInt(votingInput.votesFor) || 0) +
                          (parseInt(votingInput.votesAgainst) || 0) +
                          (parseInt(votingInput.abstentions) || 0)}{' '}
                        = {currentVoters} Stimmberechtigte
                      </span>
                    ) : (
                      <span className="text-red-700">
                        ⚠ Prüfung:{' '}
                        {(parseInt(votingInput.votesFor) || 0) +
                          (parseInt(votingInput.votesAgainst) || 0) +
                          (parseInt(votingInput.abstentions) || 0)}{' '}
                        ≠ {currentVoters} Stimmberechtigte
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ) : null}

              {/* Voting Result Display */}
              {currentItem.votingResult && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">Abstimmungsergebnis</h5>
                    <Badge
                      className={
                        currentItem.decisionResult === 'Angenommen'
                          ? 'bg-green-500'
                          : currentItem.decisionResult === 'Abgelehnt'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                      }
                    >
                      {currentItem.decisionResult === 'Angenommen' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : currentItem.decisionResult === 'Abgelehnt' ? (
                        <XCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {currentItem.decisionResult}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="text-green-600">
                      <div className="text-xl font-bold">
                        {currentItem.votingResult.votesFor}
                      </div>
                      <div className="text-sm">Ja-Stimmen</div>
                    </div>
                    <div className="text-red-600">
                      <div className="text-xl font-bold">
                        {currentItem.votingResult.votesAgainst}
                      </div>
                      <div className="text-sm">Nein-Stimmen</div>
                    </div>
                    <div className="text-gray-600">
                      <div className="text-xl font-bold">
                        {currentItem.votingResult.abstentions}
                      </div>
                      <div className="text-sm">Enthaltungen</div>
                    </div>
                    <div className="text-blue-600">
                      <div className="text-xl font-bold">
                        {currentItem.votingResult.totalVoters}
                      </div>
                      <div className="text-sm">Gesamt</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info für TOPs ohne Abstimmung */}
          {!currentItem.requiresVoting && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Dieser TOP ist nur zur Information/Diskussion - keine
                  Abstimmung geplant.
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={() => handleUpdateCurrentItem({ isCompleted: true })}
            disabled={currentItem.isCompleted}
            className="w-full mt-6"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {currentItem.isCompleted
              ? 'TOP abgeschlossen'
              : 'TOP als abgeschlossen markieren'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
