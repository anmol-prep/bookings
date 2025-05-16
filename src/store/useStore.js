import { create } from "zustand";

export const useStore = create((set) => ({
  user: null,
  authLoading: true, // Initial loading state
  setUser: (user) => set({ user, authLoading: false }), // Update both fields
}));
