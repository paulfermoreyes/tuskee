"use client";

export const COLUMNS = [
  {
    id: "todo",
    title: "To do",
    color: "bg-sky-500",
    dateField: "todoDate",
  },
  {
    id: "inProgress",
    title: "In Progress",
    color: "bg-amber-500",
    dateField: "inProgressDate",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-500",
    dateField: "doneDate",
  },
  {
    id: "cancelled",
    title: "Cancelled",
    color: "bg-red-500",
    dateField: "cancellationDate",
  },
];

export const APP_ID =
  process.env.NEXT_PUBLIC_KANBAN_APP_ID ?? "tuskee";
export const TASK_COLLECTION_NAME = "tasks";
