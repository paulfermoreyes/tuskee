"use client";

import { AlertModal } from "@/components/AlertModal";
import { ConfettiCannon } from "@/components/Confetti";
import { DateSelectionModal } from "@/components/DateSelectionModal";
import { KanbanColumn } from "@/components/KanbanColumn"; // Updated KanbanColumn
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { APP_ID, COLUMNS, TASK_COLLECTION_NAME } from "@/constants";
import { auth, db } from "@/lib/firebase";
import { TTask, TAlertInfo, TDateModalData } from "@/types";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import clsx from "clsx";

// Import DragDropContext and DropResult from @hello-pangea/dnd
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CreateTaskModal } from "@/components/CreateTaskModal";

export default function TaskPage() {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<TAlertInfo>({
    isOpen: false,
    message: "",
  });
  const [triggerConfetti, setTriggerConfetti] = useState<number>(0);

  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] =
    useState<boolean>(false);
  const [dateModalData, setDateModalData] = useState<TDateModalData>({
    taskId: null,
    newStatus: null,
    dateField: null,
    statusTitle: "",
    currentStatusDate: "",
  });

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<TTask>();

  // Initialize Auth Listener - use the imported 'auth' instance
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthReady(true);
        console.log("User authenticated with UID:", user.uid);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Authentication error:", error);
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          setAlertInfo({
            isOpen: true,
            message: `Authentication failed: ${errorMessage}. Some features might not work.`,
          });
          setIsAuthReady(false);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Firestore Snapshot Listener for Tasks
  useEffect(() => {
    if (!isAuthReady || !db) return;
    const tasksCollectionPath = `artifacts/${APP_ID}/public/data/${TASK_COLLECTION_NAME}`;
    const q = query(collection(db, tasksCollectionPath));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedTasks = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as TTask)
        );

        console.log(fetchedTasks);
        setTasks(fetchedTasks);
        console.log("Tasks loaded/updated:", fetchedTasks.length);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setAlertInfo({
          isOpen: true,
          message: `Error fetching tasks: ${error.message}`,
        });
      }
    );
    return () => unsubscribe();
  }, [isAuthReady]);

  const handleCreateTask = async ({ description, taskDeadline }: TTask) => {
    if (!isAuthReady || !db || !userId) {
      setAlertInfo({
        isOpen: true,
        message: "Cannot create task: Authentication or database not ready.",
      });
      return;
    }
    try {
      const tasksCollectionPath = `artifacts/${APP_ID}/public/data/${TASK_COLLECTION_NAME}`;
      await addDoc(collection(db, tasksCollectionPath), {
        description,
        taskDeadline,
        createdAt: serverTimestamp(),
        status: "todo", // Default status
      });
      console.log("Task added to Firestore");
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertInfo({
        isOpen: true,
        message: `Error adding task: ${errorMessage}`,
      });
    }
  };

  const handleCreateTaskModalOpen = () => {
    setIsCreateTaskModalOpen(true);
  };

  const confirmDateAndUpdateStatus = async (selectedDate: string) => {
    const { taskId: taskId, newStatus, dateField } = dateModalData;
    if (!taskId || !newStatus || !dateField || !selectedDate || !db) {
      setAlertInfo({
        isOpen: true,
        message: "Error processing status update: Missing data.",
      });
      setIsDateModalOpen(false);
      return;
    }
    try {
      const tasksCollectionPath = `artifacts/${APP_ID}/public/data/${TASK_COLLECTION_NAME}`;
      const taskRef = doc(db, tasksCollectionPath, taskId);
      // Ensure updateData keys match Firestore field names and types
      const updateData: {
        status: string;
        [key: string]: string | Timestamp | null;
      } = {
        status: newStatus,
      };
      updateData[dateField] = Timestamp.fromDate(new Date(selectedDate));
      await updateDoc(taskRef, updateData);
      console.log(
        `Task ${taskId} status updated to ${newStatus} with date ${selectedDate} in Firestore.`
      );
      if (newStatus === "done") setTriggerConfetti((prev: number) => prev + 1);
    } catch (error: unknown) {
      console.error("Error updating order status in Firestore:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertInfo({
        isOpen: true,
        message: `Error updating order: ${errorMessage}`,
      });
    } finally {
      setIsDateModalOpen(false);
      setDateModalData({
        taskId: null,
        newStatus: null,
        dateField: null,
        statusTitle: "",
        currentStatusDate: "",
      });
    }
  };

  const handleOpenDetailsModal = (task: TTask) => {
    setSelectedOrderForDetails(task);
    setIsDetailsModalOpen(true);
  };
  const handleCloseDetailsModal = () => {
    setSelectedOrderForDetails(undefined);
    setIsDetailsModalOpen(false);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Condition #1: Dropped outside any droppable area
    if (!destination) {
      return;
    }

    // Condition #2: Did not move to a new position or column (same droppable, same index)
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the task that was dragged
    const draggedTask = tasks.find((task) => task.id === draggableId);
    if (!draggedTask) return;

    // If the column changed, trigger the date selection modal and status update
    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId;
      const updateData: {
        status: string;
        [key: string]: string | Timestamp | null;
      } = {
        status: newStatus,
      };

      const tasksCollectionPath = `artifacts/${APP_ID}/public/data/${TASK_COLLECTION_NAME}`;
      const taskRef = doc(db, tasksCollectionPath, draggableId);
      await updateDoc(taskRef, updateData);
      console.log(`Task ${draggableId} status updated to ${newStatus}`);
      if (newStatus === "orderClosed")
        setTriggerConfetti((prev: number) => prev + 1);
    }

    // Optional: If you wanted to reorder items visually *within* a column before Firestore sync,
    // you would implement that logic here for `setTasks` state.
    // For a Kanban where order within a column isn't strictly maintained by drag-n-drop (but by status),
    // we primarily care about the column change.
  };

  const sortTasks = (tasks: TTask[], column: { id: string }) => {
    return tasks
      .filter((task) => task.status === column.id)
      .sort((a, b) => {
        if (!a.taskDeadline && !b.taskDeadline) return 0;
        if (!a.taskDeadline) return 1;
        if (!b.taskDeadline) return -1;
        // Convert Timestamps to ISO strings if necessary before comparing
        const aDeadline =
          typeof a.taskDeadline === "string"
            ? a.taskDeadline
            : a.taskDeadline instanceof Timestamp
            ? a.taskDeadline.toDate().toISOString()
            : "";
        const bDeadline =
          typeof b.taskDeadline === "string"
            ? b.taskDeadline
            : b.taskDeadline instanceof Timestamp
            ? b.taskDeadline.toDate().toISOString()
            : "";
        return aDeadline.localeCompare(bDeadline); // Descending
      });
  };

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col font-['Inter',_sans-serif]">
      <header className="mb-6 text-center">
        {/* <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
          Tuskee
        </h1> */}
      </header>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        isAuthReady={isAuthReady}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 flex-grow"> */}
        <div
  className="
    flex flex-row gap-4 md:gap-6 flex-grow
    overflow-x-auto
    pb-2
    hide-scrollbar
  "
  style={{ minHeight: "1px" }} // Ensures flex children don't collapse
>
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              // Pass tasks specific to this column to KanbanColumn for Droppable
              // tasks={tasks.filter((task) => task.status === column.id)}
              tasks={sortTasks(tasks, column)}
              onOpenDetailsModal={handleOpenDetailsModal}
              // Removed onDragOver, onDrop, onDragStart as @hello-pangea/dnd handles them
            />
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ isOpen: false, message: "" })}
        isAuthReady={isAuthReady}
        onCreateTask={handleCreateTask}
      />

      <AlertModal
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ isOpen: false, message: "" })}
      />

      <DateSelectionModal
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
          setDateModalData({
            taskId: null,
            newStatus: null,
            dateField: null,
            statusTitle: "",
            currentStatusDate: "",
          });
        }}
        onConfirm={confirmDateAndUpdateStatus}
        statusTitle={dateModalData.statusTitle}
        initialDate={dateModalData.currentStatusDate}
      />

      <TaskDetailModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        order={selectedOrderForDetails}
      />

      <ConfettiCannon fire={triggerConfetti} />

      {/* Floating Action Button */}
      <button
        onClick={handleCreateTaskModalOpen}
        className={clsx("fixed bottom-6 right-6 z-50",
          "bg-indigo-600 hover:bg-indigo-700",
          "text-white text-3xl rounded-full",
          "w-16 h-16 flex items-center justify-center",
          "shadow-lg hover:shadow-2xl transition-all cursor-pointer")}
        aria-label="Add Task"
      >
        +
      </button>

      <footer className="mt-6 text-center text-sm text-slate-500">
        <p className="text-sm text-slate-500 mt-1">
          Current user:{" "}
          <span className="font-mono">
            {isAuthReady && userId ? userId : "loading..."}
          </span>
        </p>
      </footer>
    </div>
  );
}
