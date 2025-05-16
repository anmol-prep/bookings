import { create } from "zustand";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useBookingStore = create((set) => ({
  bookings: [],
  loading: true,
  error: null,

  subscribeToBookings: () => {
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookings = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startTime: data.startTime,
            endTime: data.endTime,
            userId: data.userId,
            title: data.title,
          };
        });
        set({ bookings, loading: false, error: null });
      },
      (error) => set({ error, loading: false })
    );
    return unsubscribe;
  }
}));
