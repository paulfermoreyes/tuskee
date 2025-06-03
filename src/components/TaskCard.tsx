// components/OrderCard.tsx
"use client";

import { COLUMNS } from "@/constants";
import { TTask } from "@/types";
import { formatDate } from "@/utils";
import { Draggable } from "@hello-pangea/dnd"; // Import Draggable

interface ITaskCard {
  task: TTask;
  index: number; // New prop: index of the item within its list
  onOpenDetailsModal: (order: TTask) => void;
  // Removed onDragStart prop
}

export const TaskCard = ({
  task: task,
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
          className={`bg-white p-3 rounded-md shadow-sm mb-3 text-left w-full
                               ${
                                 snapshot.isDragging
                                   ? "shadow-xl ring-2 ring-indigo-500"
                                   : "hover:shadow-lg transition-shadow cursor-grab"
                               }`}
          // Removed draggable HTML attribute and onDragStart event listener
        >
          <h4 className="font-semibold text-sm text-slate-800 break-words mb-1">
            {task.description || "No Description"}
          </h4>
          {task.taskDeadline !== undefined && (
            <p className="text-xs text-slate-500">
              Task deadline: {formatDate(task.taskDeadline ?? "")}
            </p>
          )}
          {/* {dateField &&
            order[dateField as keyof TTask] &&
            order.status !== "purchaseOrder" && (
              <p className="text-xs text-slate-500 capitalize">
                {order.status?.replace(/([A-Z])/g, " $1") ?? "Unknown"} Date:{" "}
                {formatDate(order[dateField as keyof TTask] ?? "")}
              </p>
            )} */}
          {/* <p className="text-xs text-slate-400 mt-1">
            ID: {order.id ? order.id.substring(0, 8) + "..." : "N/A"}
          </p> */}
        </div>
      )}
    </Draggable>
  );
};
