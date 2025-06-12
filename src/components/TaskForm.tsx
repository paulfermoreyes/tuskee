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
  const [taskDeadline, setTaskDeadline] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      let message = "Task description is required.";

      setAlertInfo({
        isOpen: true,
        message: message,
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
      taskDeadline: taskDeadline,
    });

    setDescription("");
    setTaskDeadline(() => new Date().toISOString().split("T")[0]);

    if (onClose) {
      onClose();
    }
  };

  const renderButtons = () => (
    <div className="flex justify-end gap-x-2">
      <button
        type="button"
        className="bg-gray-300 hover:bg-gray-700 text-gray-800 hover:text-gray-300 font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        Create task
      </button>
    </div>
  );

  return (
    <>
      <div className="mb-1 p-4">
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
            <label htmlFor="hasDeadline" className="text-sm text-slate-600">
              Set a deadline
            </label>
            <input
              type="date"
              id="poDate"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {renderButtons()}
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
