
"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { boardMeetings } from "@/lib/mock-data"; 
import { Meeting } from "@/lib/types";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// Hilfsfunktion zum Neuanordnen
const reorder = (list: Meeting[], startIndex: number, endIndex: number): Meeting[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function MeetingBoardClient() {
  const [meetings, setMeetings] = useState<Meeting[]>(boardMeetings);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reorderedMeetings = reorder(
      meetings,
      result.source.index,
      result.destination.index
    );
    setMeetings(reorderedMeetings);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="meetings">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {meetings.map((meeting, index) => (
              <Draggable key={meeting.id} draggableId={meeting.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "p-4 border rounded-md shadow-sm flex items-start gap-3 transition-colors",
                        snapshot.isDragging ? "bg-accent" : "bg-white"
                    )}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                        <h3 className="font-bold">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">{meeting.description}</p>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
