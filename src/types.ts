"use client";

import { Timestamp } from "@firebase/firestore";

export interface TTask {
  id?: string;
  description: string;
  createdAt?: Timestamp;
  taskDeadline?: Timestamp | string;
  status?: string;

  [key: string]: Timestamp | undefined | string | number | null;
}

export interface TDateModalData {
  taskId: string | null;
  newStatus: string | null;
  dateField: string | null;
  statusTitle: string;
  currentStatusDate: string;
}

export interface TAlertInfo {
  isOpen: boolean;
  message: string;
}
