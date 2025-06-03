"use client";

import { TTask } from "@/types";
import { useState } from "react";
import { AlertModal } from "./AlertModal";

interface ITaskForm {
  onCreateTask: (order: TTask) => void;
  isAuthReady: boolean;
  onClose?: () => void; // Optional onClose prop for modal use
}

export const TaskForm = ({ onCreateTask, isAuthReady, onClose }: ITaskForm) => {
  const [description, setDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState<string | undefined>(undefined);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim() || !taskDeadline) {
      setAlertInfo({
        isOpen: true,
        message: "Task description and deadline are required.",
      });
      return;
    }

    if (!isAuthReady) {
      setAlertInfo({
        isOpen: true,
        message: "Authentication not ready. Please wait or refresh.",
      });
      return;
    }

    onCreateTask({
      description,
      taskDeadline: hasDeadline ? taskDeadline : undefined,
    });

    setDescription("");
    setTaskDeadline(undefined);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="mb-6 p-4">
        <h2 className="text-xl font-semibold mb-3 text-indigo-500">
          Create task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
          />
          <div>
            <input
              type="checkbox"
              id="hasDeadline"
              checked={hasDeadline}
              onChange={(e) => setHasDeadline(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hasDeadline" className="text-sm text-slate-600">
              Set a deadline
            </label>
            {hasDeadline && (
              <input
                type="date"
                id="poDate"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gray-300 hover:bg-gray-700 text-gray-800 hover:text-gray-300 font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            Create task
          </button>
        </form>
      </div>
      <AlertModal
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ isOpen: false, message: "" })}
      />
    </>
  );
};
