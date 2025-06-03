"use client";

import { TaskForm } from "./TaskForm";
import { TTask } from "@/types";

type ICreateTaskModal = {
  onClose: () => void;
  isOpen: boolean;
  onCreateTask?: (task: TTask) => void;
  isAuthReady: boolean;
};
export const CreateTaskModal = ({
  onClose,
  isOpen,
  onCreateTask,
  isAuthReady
}: ICreateTaskModal) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-[10003] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <TaskForm
          isAuthReady={isAuthReady}
          onCreateTask={(task) => {
            if (onCreateTask) {
              onCreateTask({description: task.description, taskDeadline: task.taskDeadline});
            }
            onClose();
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
