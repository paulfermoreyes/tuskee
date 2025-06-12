// components/KanbanColumn.tsx
"use client";

import { TTask } from "@/types";
import { TaskCard } from "./TaskCard"; // Ensure OrderCard is updated to use Draggable
import { Droppable } from "@hello-pangea/dnd"; // Import Droppable

interface IKanbanColumn {
  column: {
    id: string;
    title: string;
    color: string;
  };
  tasks: TTask[]; // Tasks already filtered for this column
  onOpenDetailsModal: (task: TTask) => void;
  // Removed onDragOver, onDrop, onDragStart props
}

const renderTasks = (tasks: TTask[], onOpenDetailsModal: (task: TTask) => void) => {
  return tasks.map((task, index) => (
    <TaskCard
      key={task.id}
      task={task}
      index={index}
      onOpenDetailsModal={onOpenDetailsModal}
    />
  ));
};

export const KanbanColumn = ({
  column,
  tasks,
  onOpenDetailsModal,
}: IKanbanColumn) => {
  return (
    <Droppable droppableId={column.id}>
      {(
        provided,
        snapshot // Use the render prop pattern
      ) => (
        <div
          className={"bg-slate-200 p-3 md:p-4 rounded-lg shadow-md flex flex-col transition-colors min-w-[320px]"
            + (snapshot.isDraggingOver ? " bg-slate-300/70" : "")}
          aria-label={`Kanban column: ${column.title}`}
          tabIndex={0}
          role="region"
          // Removed manual onDragOver, onDragEnter, onDragLeave, onDrop, onKeyDown
        >
          <h3
            className={`text-lg font-semibold mb-4 text-center text-white px-3 py-1.5 rounded-md ${column.color}`}
          >
            {column.title}
          </h3>
          <div
            ref={provided.innerRef} // Apply innerRef to the DOM element
            {...provided.droppableProps} // Apply droppableProps
            className="kanban-column-content flex-grow min-h-[200px] space-y-0 p-1 rounded-md bg-slate-100/50 overflow-y-auto max-h-[calc(100vh-450px)] md:max-h-[calc(100vh-300px)]"
          >
            {renderTasks(tasks, onOpenDetailsModal)}
            {provided.placeholder} {/* Essential for correct drag visual */}
            {tasks.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">
                No orders here.
              </p>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
};
