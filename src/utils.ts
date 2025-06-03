"use client";

import { Timestamp } from 'firebase/firestore'

export const formatDate = (timestamp: Timestamp | string | number) => {
    if (typeof timestamp === 'string') {
        return timestamp; 
    }

    if (typeof timestamp === 'number') {
        timestamp = new Timestamp(timestamp, 0); // Convert number to Firestore Timestamp
    }

    return timestamp.toDate().toLocaleDateString(); // Firestore Timestamp
};