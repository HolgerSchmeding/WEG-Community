'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Timer
} from 'lucide-react';
import { LiveProtocolSession, LiveProtocolItem, VotingResult, DecisionResult } from '@/lib/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface LiveProtocolSessionProps {
  session: LiveProtocolSession;
  onUpdateSession: (session: LiveProtocolSession) => void;
}

export function LiveProtocolSessionComponent({ session, onUpdateSession }: LiveProtocolSessionProps) {
  const [discussionInput, setDiscussionInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [votingInput, setVotingInput] = useState({
    votesFor: '',
    votesAgainst: '',
    abstentions: ''
  });
  const [decisionInput, setDecisionInput] = useState('');
  const [isImprovingText, setIsImprovingText] = useState(false);
  const discussionRef = useRef<HTMLTextAreaElement>(null);

  const currentItem = session.items[session.currentTopIndex];

  // Automatische Validierung der Abstimmung
  const validateVoting = (votesFor: number, votesAgainst: number, abstentions: number): boolean => {
    const total = votesFor + votesAgainst + abstentions;
    return total === session.totalVoters;
  };

  const handleStatusChange = (newStatus: "Vorbereitung" | "Laufend" | "Pausiert" | "Abgeschlossen") => {
    const updatedSession = {
      ...session,
      status: newStatus,
      startTime: newStatus === "Laufend" && !session.startTime ? new Date() : session.startTime,
      endTime: newStatus === "Abgeschlossen" ? new Date() : undefined
    };
    onUpdateSession(updatedSession);
  };

  const handleNavigateTop = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, session.currentTopIndex - 1)
      : Math.min(session.items.length - 1, session.currentTopIndex + 1);
    
    const updatedSession = {
      ...session,
      currentTopIndex: newIndex
    };
    onUpdateSession(updatedSession);
    
    // Reset input fields when switching TOPs
    const newCurrentItem = session.items[newIndex];
    setDiscussionInput(newCurrentItem.discussion || '');
    setKeywordsInput(newCurrentItem.keywords || '');
    setDecisionInput(newCurrentItem.decision || '');
    setVotingInput({
      votesFor: newCurrentItem.votingResult?.votesFor.toString() || '',
      votesAgainst: newCurrentItem.votingResult?.votesAgainst.toString() || '',
      abstentions: newCurrentItem.votingResult?.abstentions.toString() || ''
    });
  };

  const handleUpdateCurrentItem = (updates: Partial<LiveProtocolItem>) => {
    const updatedItems = session.items.map((item, index) => 
      index === session.currentTopIndex 
        ? { ...item, ...updates }
        : item
    );
    
    const updatedSession = {
      ...session,
      items: updatedItems
    };
    onUpdateSession(updatedSession);
  };

  const handleSaveVoting = () => {
    const votesFor = parseInt(votingInput.votesFor) || 0;
    const votesAgainst = parseInt(votingInput.votesAgainst) || 0;
    const abstentions = parseInt(votingInput.abstentions) || 0;
    
    const isValid = validateVoting(votesFor, votesAgainst, abstentions);
    
    const votingResult: VotingResult = {
      votesFor,
      votesAgainst,
      abstentions,
      totalVoters: session.totalVoters,
      isValid
    };

    // Automatische Entscheidung basierend auf Abstimmung
    let decisionResult: DecisionResult = "Keine Abstimmung";
    if (votesFor > votesAgainst) {
      decisionResult = "Angenommen";
    } else if (votesAgainst > votesFor) {
      decisionResult = "Abgelehnt";
    } else if (votesFor === votesAgainst && votesFor > 0) {
      decisionResult = "Vertagt"; // Bei Gleichstand
    }

    handleUpdateCurrentItem({
      votingResult,
      decisionResult,
      decision: decisionInput,
      endTime: new Date()
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
          discussion: discussionInput
        })
      });

      if (response.ok) {
        const { improvedText } = await response.json();
        setDiscussionInput(prev => prev + '\n\n' + improvedText);
      }
    } catch (error) {
      console.error('Fehler bei KI-Verbesserung:', error);
    } finally {
      setIsImprovingText(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Laufend": return "bg-green-500";
      case "Pausiert": return "bg-yellow-500";
      case "Abgeschlossen": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const completedTopCount = session.items.filter(item => item.isCompleted).length;
  const progress = (completedTopCount / session.items.length) * 100;

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
                Versammlungsleiter: {session.chairperson} • 
                Protokollführer: {session.secretary}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {session.totalVoters} Stimmberechtigte
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
              onClick={() => handleStatusChange("Laufend")}
              variant={session.status === "Laufend" ? "default" : "outline"}
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
            <Button 
              onClick={() => handleStatusChange("Pausiert")}
              variant={session.status === "Pausiert" ? "default" : "outline"}
              size="sm"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button 
              onClick={() => handleStatusChange("Abgeschlossen")}
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
              <span>{completedTopCount} von {session.items.length} TOP abgeschlossen</span>
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
            <CardTitle className="flex items-center gap-2">
              TOP {currentItem.topNumber}: {currentItem.title}
            </CardTitle>
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
          {/* Discussion Protocol */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Diskussion & Protokoll
            </h4>
            <Textarea
              ref={discussionRef}
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
              onBlur={() => handleUpdateCurrentItem({ discussion: discussionInput })}
              placeholder="Diskussion live protokollieren..."
              className="min-h-32"
            />
            
            {/* KI-Unterstützung */}
            <div className="flex gap-2">
              <Input
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                onBlur={() => handleUpdateCurrentItem({ keywords: keywordsInput })}
                placeholder="Stichworte für KI-Formulierungshilfe..."
                className="flex-1"
              />
              <Button 
                onClick={handleImproveWithAI}
                disabled={!keywordsInput.trim() || isImprovingText}
                variant="outline"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {isImprovingText ? 'Formuliere...' : 'KI-Hilfe'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Decision & Voting */}
          <div className="space-y-4">
            <h4 className="font-semibold">Beschluss & Abstimmung</h4>
            
            <div className="space-y-3">
              <Textarea
                value={decisionInput}
                onChange={(e) => setDecisionInput(e.target.value)}
                placeholder="Beschluss-Text eingeben..."
                rows={3}
              />

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-sm font-medium text-green-600">Ja-Stimmen</label>
                  <Input
                    type="number"
                    value={votingInput.votesFor}
                    onChange={(e) => setVotingInput(prev => ({ ...prev, votesFor: e.target.value }))}
                    placeholder="0"
                    min="0"
                    max={session.totalVoters}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-red-600">Nein-Stimmen</label>
                  <Input
                    type="number"
                    value={votingInput.votesAgainst}
                    onChange={(e) => setVotingInput(prev => ({ ...prev, votesAgainst: e.target.value }))}
                    placeholder="0"
                    min="0"
                    max={session.totalVoters}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Enthaltungen</label>
                  <Input
                    type="number"
                    value={votingInput.abstentions}
                    onChange={(e) => setVotingInput(prev => ({ ...prev, abstentions: e.target.value }))}
                    placeholder="0"
                    min="0"
                    max={session.totalVoters}
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
              {votingInput.votesFor || votingInput.votesAgainst || votingInput.abstentions ? (
                <Alert className={validateVoting(
                  parseInt(votingInput.votesFor) || 0,
                  parseInt(votingInput.votesAgainst) || 0,
                  parseInt(votingInput.abstentions) || 0
                ) ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {validateVoting(
                      parseInt(votingInput.votesFor) || 0,
                      parseInt(votingInput.votesAgainst) || 0,
                      parseInt(votingInput.abstentions) || 0
                    ) ? (
                      <span className="text-green-700">
                        ✓ Stimmen stimmen überein ({(parseInt(votingInput.votesFor) || 0) + (parseInt(votingInput.votesAgainst) || 0) + (parseInt(votingInput.abstentions) || 0)} = {session.totalVoters})
                      </span>
                    ) : (
                      <span className="text-red-700">
                        ⚠ Stimmen stimmen nicht überein ({(parseInt(votingInput.votesFor) || 0) + (parseInt(votingInput.votesAgainst) || 0) + (parseInt(votingInput.abstentions) || 0)} ≠ {session.totalVoters})
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ) : null}

              {/* Voting Result Display */}
              {currentItem.votingResult && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Abstimmungsergebnis</h5>
                    <Badge className={currentItem.decisionResult === "Angenommen" ? "bg-green-500" : 
                                   currentItem.decisionResult === "Abgelehnt" ? "bg-red-500" : "bg-yellow-500"}>
                      {currentItem.decisionResult === "Angenommen" ? <CheckCircle className="h-3 w-3 mr-1" /> :
                       currentItem.decisionResult === "Abgelehnt" ? <XCircle className="h-3 w-3 mr-1" /> :
                       <AlertTriangle className="h-3 w-3 mr-1" />}
                      {currentItem.decisionResult}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-green-600">
                      <div className="text-lg font-semibold">{currentItem.votingResult.votesFor}</div>
                      <div className="text-sm">Ja-Stimmen</div>
                    </div>
                    <div className="text-red-600">
                      <div className="text-lg font-semibold">{currentItem.votingResult.votesAgainst}</div>
                      <div className="text-sm">Nein-Stimmen</div>
                    </div>
                    <div className="text-gray-600">
                      <div className="text-lg font-semibold">{currentItem.votingResult.abstentions}</div>
                      <div className="text-sm">Enthaltungen</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={() => handleUpdateCurrentItem({ isCompleted: true })}
              disabled={currentItem.isCompleted}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {currentItem.isCompleted ? 'TOP abgeschlossen' : 'TOP als abgeschlossen markieren'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
