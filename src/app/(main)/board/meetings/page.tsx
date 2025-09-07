'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import dynamic from 'next/dynamic';
import React from 'react';
import { BackButton } from '@/components/back-button';
import { ListChecks } from 'lucide-react';
import MeetingPlannerPanel from '@/components/board/meeting-planner-panel';
import ProtocolViewer from '@/components/board/protocol-viewer';

// Dynamischer Import der Client-Komponente mit deaktiviertem SSR
const MeetingBoard = dynamic(
  () => import('@/components/board/meeting-board-client'),
  {
    ssr: false,
  }
);

export default function BoardMeetingsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <BackButton text="Zurück zum Beirats-Dashboard" />
      </div>
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/20 p-4 rounded-lg mb-6">
          <ListChecks className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Versammlungen planen (Drag & Drop)
        </h1>
        <p className="mt-2 text-muted-foreground">
          Planen Sie Versammlungen und organisieren Sie die Tagesordnungspunkte
          per Drag & Drop.
        </p>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left column - Meeting Planning */}
        <div className="xl:col-span-3">
          <MeetingPlannerPanel />
        </div>

        {/* Middle column - Agenda Management */}
        <div className="xl:col-span-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Tagesordnungspunkte</CardTitle>
              <CardDescription>
                Ordnen Sie die Themen für die nächste Versammlung.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <MeetingBoard />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Protocol Viewer */}
        <div className="xl:col-span-3">
          <ProtocolViewer />
        </div>
      </div>
    </div>
  );
}
