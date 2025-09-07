'use client';

import { lastMeetingProtocol } from '@/lib/mock-data';
import { MeetingProtocol, DecisionResult } from '@/lib/types';
import {
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ScrollText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProtocolViewerProps {
  protocol?: MeetingProtocol;
}

export default function ProtocolViewer({
  protocol = lastMeetingProtocol,
}: ProtocolViewerProps) {
  const getDecisionIcon = (result?: DecisionResult) => {
    switch (result) {
      case 'Angenommen':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Abgelehnt':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Vertagt':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'Keine Abstimmung':
        return <ScrollText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDecisionColor = (result?: DecisionResult) => {
    switch (result) {
      case 'Angenommen':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Abgelehnt':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Vertagt':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Keine Abstimmung':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entwurf':
        return 'bg-gray-100 text-gray-800';
      case 'Zur Prüfung':
        return 'bg-blue-100 text-blue-800';
      case 'Genehmigt':
        return 'bg-green-100 text-green-800';
      case 'Veröffentlicht':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Protokoll der letzten Versammlung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Protocol Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{protocol.meetingTitle}</h3>
            <Badge className={getStatusColor(protocol.status)}>
              {protocol.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(protocol.meetingDate, 'dd. MMMM yyyy', { locale: de })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {protocol.attendees}/{protocol.totalVotes} Teilnehmer
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div>
              <strong>Versammlungsleiter:</strong> {protocol.chairperson}
            </div>
            <div>
              <strong>Protokollführer:</strong> {protocol.secretary}
            </div>
          </div>
        </div>

        <Separator />

        {/* Protocol Items */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Wichtige Beschlüsse</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {protocol.items
              .filter(
                item =>
                  item.decision ||
                  item.decisionResult === 'Angenommen' ||
                  item.decisionResult === 'Abgelehnt'
              )
              .map(item => (
                <div key={item.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          TOP {item.topNumber}
                        </span>
                        {getDecisionIcon(item.decisionResult)}
                      </div>
                      <h5 className="font-medium text-sm leading-tight">
                        {item.title}
                      </h5>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {item.discussion}
                  </div>

                  {item.decision && (
                    <div
                      className={cn(
                        'text-xs p-2 rounded border',
                        getDecisionColor(item.decisionResult)
                      )}
                    >
                      <strong>Beschluss:</strong> {item.decision}
                    </div>
                  )}

                  {(item.votesFor !== undefined ||
                    item.votesAgainst !== undefined) && (
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-600">
                        ✓ {item.votesFor || 0}
                      </span>
                      <span className="text-red-600">
                        ✗ {item.votesAgainst || 0}
                      </span>
                      {(item.abstentions || 0) > 0 && (
                        <span className="text-gray-500">
                          ⊘ {item.abstentions}
                        </span>
                      )}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-xs text-muted-foreground italic">
                      <strong>Anmerkung:</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <Separator />

        {/* Quick Stats */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Übersicht</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded text-center">
              <div className="font-bold text-green-700">
                {
                  protocol.items.filter(i => i.decisionResult === 'Angenommen')
                    .length
                }
              </div>
              <div className="text-green-600">Angenommen</div>
            </div>
            <div className="bg-red-50 p-2 rounded text-center">
              <div className="font-bold text-red-700">
                {
                  protocol.items.filter(i => i.decisionResult === 'Abgelehnt')
                    .length
                }
              </div>
              <div className="text-red-600">Abgelehnt</div>
            </div>
          </div>
        </div>

        {/* Reference Note */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
          💡 <strong>Hinweis:</strong> Vollständiges Protokoll in den Dokumenten
          verfügbar.
        </div>
      </CardContent>
    </Card>
  );
}
