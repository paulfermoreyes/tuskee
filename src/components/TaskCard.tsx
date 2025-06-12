// components/OrderCard.tsx
"use client";

import { TTask } from "@/types";
import { formatDate } from "@/utils";
import { Draggable, DraggableStateSnapshot } from "@hello-pangea/dnd"; // Import Draggable
import { Timestamp } from "firebase/firestore";

interface ITaskCard {
  task: TTask;
  index: number; // New prop: index of the item within its list
  onOpenDetailsModal: (order: TTask) => void;
  // Removed onDragStart prop
}

const hasDatePassedToday = (date: string | undefined): boolean => {
  if (!date) return false;
  const taskDate = new Date(date);
  const today = new Date();
  return taskDate < today;
}

const isStillPending = (task: TTask): boolean => {
  return !["done", "cancelled", undefined].includes(task.status)
}

export const TaskCard = ({
  task,
  index,
  onOpenDetailsModal,
}: ITaskCard) => {
  return (
    <Draggable draggableId={task.id || `task-${index}`} index={index}>
      {(
        provided,
        snapshot // Use the render prop pattern
      ) => (
        <div
          ref={provided.innerRef} // Apply innerRef to the DOM element
          {...provided.draggableProps} // Apply draggableProps
          {...provided.dragHandleProps} // Apply dragHandleProps (makes the button itself draggable)
          onClick={() => onOpenDetailsModal(task)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenDetailsModal(task);
            }
          }}
          className={"p-3 rounded-md shadow-sm mb-3 text-left w-full"
            + (snapshot.isDragging ? " shadow-xl ring-2 ring-indigo-500" : " hover:shadow-lg transition-shadow cursor-grab")
            + (task.status === "cancelled" ? " opacity-50 cursor-not-allowed" : "")
            + (
              hasDatePassedToday(task.taskDeadline as string) && isStillPending(task)
                ? " bg-red-50"
                : " bg-white"
            )
        }>
          <h4 className={`font-semibold text-sm text-slate-800 break-words mb-1`
            + (task.status === "cancelled" ? " line-through text-slate-500" : "")
            + (hasDatePassedToday(task.taskDeadline as string) ? " text-red-800" : "")
          }>
            {task.description || "No Description"}
          </h4>
          <p className="text-xs text-slate-500">
            Task deadline: {formatDate(task.taskDeadline ?? "")}
          </p>
        </div>
      )}
    </Draggable>
  );
};
