"use client";

import { useEffect, useState } from "react";

interface IDateSelectionModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  statusTitle?: string;
  initialDate?: string; // Optional initial date
}

export const DateSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  statusTitle,
  initialDate,
}: IDateSelectionModal) => {
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialDate ?? new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) {
      console.warn("Date not selected");
      return;
    }
    onConfirm(selectedDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10002] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
      >
        <h3 className="text-lg font-semibold mb-4 text-slate-700">
          Set Date for {statusTitle}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow mb-4"
          required
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Confirm Date
          </button>
        </div>
      </form>
    </div>
  );
};
