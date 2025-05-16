import React, { useEffect, useState } from "react";
import CalendarView from "../features/calendar/CalendarView";
import BookingModal from "../features/calendar/BookingModal";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const { user, authLoading, setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Conference Room Booking</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm sm:text-base break-all max-w-[200px] sm:max-w-none">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-4 container mx-auto">
        <CalendarView
          onDateSelect={(slot) => setSelectedSlot(slot)}
          onEventEdit={(booking) => setEditBooking(booking)}
        />
        {/* Create Modal */}
        <BookingModal
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          selectedSlot={selectedSlot}
          mode="create"
        />
        {/* Edit Modal */}
        <BookingModal
          isOpen={!!editBooking}
          onClose={() => setEditBooking(null)}
          editBooking={editBooking}
          mode="edit"
        />
      </main>
    </div>
  );
}
