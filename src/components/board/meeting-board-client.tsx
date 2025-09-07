'use client';

import { useState } from 'react';
import { boardMeetings, standardAgendaTemplate } from '@/lib/mock-data';
import { Meeting } from '@/lib/types';
import {
  GripVertical,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Save,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface EditingItem {
  id: string;
  title: string;
  description: string;
}

export default function MeetingBoardClient() {
  const [meetings, setMeetings] = useState<Meeting[]>(boardMeetings);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [newItem, setNewItem] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isImprovingWithAI, setIsImprovingWithAI] = useState(false);
  const [improvingItemId, setImprovingItemId] = useState<string | null>(null);

  // Drag & Drop Logic (unchanged)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    setDraggedOverItem(id);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverItem(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      setDraggedOverItem(null);
      return;
    }

    const draggedIndex = meetings.findIndex(m => m.id === draggedItem);
    const targetIndex = meetings.findIndex(m => m.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newMeetings = [...meetings];
    const [removed] = newMeetings.splice(draggedIndex, 1);
    newMeetings.splice(targetIndex, 0, removed);

    setMeetings(newMeetings);
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMeetings = [...meetings];
    [newMeetings[index], newMeetings[index - 1]] = [
      newMeetings[index - 1],
      newMeetings[index],
    ];
    setMeetings(newMeetings);
  };

  const moveDown = (index: number) => {
    if (index === meetings.length - 1) return;
    const newMeetings = [...meetings];
    [newMeetings[index], newMeetings[index + 1]] = [
      newMeetings[index + 1],
      newMeetings[index],
    ];
    setMeetings(newMeetings);
  };

  // CRUD Operations
  const addNewItem = () => {
    if (!newItem?.title.trim()) return;

    const newMeeting: Meeting = {
      id: `top-${Date.now()}`,
      title: newItem.title.trim(),
      description: newItem.description.trim(),
    };

    setMeetings([...meetings, newMeeting]);
    setNewItem(null);
  };

  const startEdit = (meeting: Meeting) => {
    setEditingItem({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
    });
  };

  const saveEdit = () => {
    if (!editingItem) return;

    setMeetings(
      meetings.map(m =>
        m.id === editingItem.id
          ? {
              ...m,
              title: editingItem.title,
              description: editingItem.description,
            }
          : m
      )
    );
    setEditingItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const resetToTemplate = () => {
    setMeetings([...standardAgendaTemplate]);
    setEditingItem(null);
    setNewItem(null);
  };

  // KI-Verbesserungs-Funktionen
  const improveWithAI = async (
    item: { title: string; description: string },
    isNewItem = false
  ) => {
    if (isNewItem) {
      setIsImprovingWithAI(true);
    } else {
      setImprovingItemId(item.title); // Use title as ID for identifying which item is being improved
    }

    try {
      const response = await fetch('/api/agenda/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          meetingType: 'eigentümerversammlung',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve with AI');
      }

      const result = await response.json();

      if (isNewItem && newItem) {
        setNewItem({
          title: result.improvedTitle,
          description: result.improvedDescription,
        });
      } else if (editingItem) {
        setEditingItem({
          ...editingItem,
          title: result.improvedTitle,
          description: result.improvedDescription,
        });
      }
    } catch (error) {
      console.error('Error improving with AI:', error);
      // TODO: Show error toast/notification
    } finally {
      setIsImprovingWithAI(false);
      setImprovingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg">
        <Button
          variant="default"
          size="sm"
          onClick={() => setNewItem({ title: '', description: '' })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Neuer TOP
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Standard-Vorlage laden
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Standard-Tagesordnung laden</AlertDialogTitle>
              <AlertDialogDescription>
                Möchten Sie die aktuelle Tagesordnung durch die
                Standard-WEG-Vorlage ersetzen? Alle aktuellen Änderungen gehen
                verloren.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={resetToTemplate}>
                Ja, Standard-Vorlage laden
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="ml-auto text-sm text-muted-foreground">
          {meetings.length} Tagesordnungspunkte
        </div>
      </div>

      {/* Add New Item Form */}
      {newItem && (
        <Card className="p-4 border-primary/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Neuen Tagesordnungspunkt hinzufügen
              </h4>
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                KI-Assistent verfügbar
              </Badge>
            </div>
            <Input
              placeholder="Titel des Tagesordnungspunkts..."
              value={newItem.title}
              onChange={e => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Textarea
              placeholder="Beschreibung oder Stichworte (z.B. 'Heizungsaustausch', 'neue Hausordnung', 'PV-Anlage')..."
              value={newItem.description}
              onChange={e =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              rows={2}
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={addNewItem}
                size="sm"
                disabled={!newItem.title.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Hinzufügen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => improveWithAI(newItem, true)}
                disabled={!newItem.title.trim() || isImprovingWithAI}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
              >
                {isImprovingWithAI ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1" />
                )}
                {isImprovingWithAI ? 'KI arbeitet...' : 'Mit KI verbessern'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewItem(null)}
              >
                <X className="h-4 w-4 mr-1" />
                Abbrechen
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Help Text */}
      <div className="text-sm text-muted-foreground mb-4">
        💡 Ziehen Sie die Tagesordnungspunkte per Drag & Drop oder verwenden Sie
        die Pfeiltasten zum Sortieren.
      </div>

      {/* Meeting Items */}
      {meetings.map((meeting, index) => (
        <Card
          key={meeting.id}
          draggable={!editingItem}
          onDragStart={e => !editingItem && handleDragStart(e, meeting.id)}
          onDragOver={handleDragOver}
          onDragEnter={e => handleDragEnter(e, meeting.id)}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDrop(e, meeting.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            'p-4 transition-all duration-200',
            !editingItem && 'cursor-move',
            draggedItem === meeting.id && 'opacity-50 scale-95',
            draggedOverItem === meeting.id && 'border-primary border-2',
            editingItem?.id === meeting.id && 'border-blue-500 border-2',
            'hover:shadow-md'
          )}
        >
          <div className="flex items-start gap-3">
            {/* Drag Handle & Arrow Controls */}
            <div className="flex flex-col items-center gap-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || !!editingItem}
                  title="Nach oben"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveDown(index)}
                  disabled={index === meetings.length - 1 || !!editingItem}
                  title="Nach unten"
                >
                  ↓
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {editingItem?.id === meeting.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    value={editingItem.title}
                    onChange={e =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="font-bold text-lg"
                  />
                  <Textarea
                    value={editingItem.description}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={saveEdit} size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Speichern
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => improveWithAI(editingItem)}
                      disabled={improvingItemId === editingItem.title}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
                    >
                      {improvingItemId === editingItem.title ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      {improvingItemId === editingItem.title
                        ? 'KI arbeitet...'
                        : 'Mit KI verbessern'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    TOP {index + 1}: {meeting.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {meeting.description}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                #{index + 1}
              </div>
              {editingItem?.id !== meeting.id && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEdit(meeting)}
                    title="Bearbeiten"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Tagesordnungspunkt löschen
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchten Sie "{meeting.title}" wirklich löschen? Diese
                          Aktion kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteItem(meeting.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Summary */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <Plus className="h-4 w-4" />
          <span className="font-medium">Tagesordnung bereit</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Die {meetings.length} Tagesordnungspunkte sind sortiert und können für
          die Versammlung verwendet werden.
        </p>
      </div>
    </div>
  );
}
