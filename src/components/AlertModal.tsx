
"use client";

import React from "react";

type AlertModalProps = {
    message: string;
    onClose: () => void;
    isOpen: boolean;
};
export const AlertModal = ({ message, onClose, isOpen }: AlertModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10003] p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <p className="text-slate-700 mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    OK
                </button>
            </div>
        </div>
    );
};