"use client";

import { COLUMNS } from "@/constants";
import { TTask } from "@/types";
import { formatDate } from "@/utils";

interface ITaskDetailModal {
    isOpen: boolean;
    onClose: () => void;
    order?: TTask;
}

export const TaskDetailModal = ({ isOpen, onClose, order: task }: ITaskDetailModal) => {
    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-indigo-600">Task Details</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl font-bold">&times;</button>
                </div>
                <div className="space-y-3">
                    <p><strong className="text-slate-600">Description:</strong> <span className="text-slate-800">{task.description}</span></p>
                    <p><strong className="text-slate-600">Deadline:</strong> <span className="text-slate-800">{task.taskDeadline !== undefined ? task.taskDeadline?.toString() : "None"}</span></p>

                    <hr className="my-3"/>
                    <h4 className="text-md font-semibold text-slate-700">Status Dates:</h4>
                    {COLUMNS.map(col => {
                        if (task[col.dateField]) {
                            return <p key={col.id}><strong className="text-slate-600">{col.title} Date:</strong> <span className="text-slate-800">{formatDate(task[col.dateField] ?? '')}</span></p>;
                        }
                        return null;
                    })}
                     <p><strong className="text-slate-600">Created At:</strong> <span className="text-slate-800">{formatDate(task.createdAt ?? '')}</span></p>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};