import React, { useState, useEffect } from "react";
import { addDoc, collection, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";

export default function BookingModal({ isOpen, onClose, selectedSlot, editBooking, mode = "create" }) {
  const { user } = useStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && editBooking) {
      setTitle(editBooking.title);
      const start = editBooking.startTime?.toDate();
      const end = editBooking.endTime?.toDate();
      setStartTime(start ? `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}` : "");
      setEndTime(end ? `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}` : "");
    } else if (mode === "create" && isOpen && selectedSlot) {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      setTitle("");
      setStartTime(`${pad(now.getHours())}:00`);
      setEndTime(`${pad((now.getHours() + 1) % 24)}:00`);
    }
  }, [isOpen, selectedSlot, editBooking, mode]);

  if (!isOpen || (mode === "edit" && !editBooking) || (mode === "create" && !selectedSlot)) return null;

  const combineDateAndTime = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const newDate = new Date(date);
    newDate.setHours(Number(hours), Number(minutes), 0, 0);
    return newDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to book a room.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      if (mode === "create") {
        const start = combineDateAndTime(selectedSlot.start, startTime);
        const end = combineDateAndTime(selectedSlot.start, endTime);

        if (end <= start) throw new Error("End time must be after start time");

        await addDoc(collection(db, "bookings"), {
          title,
          startTime: Timestamp.fromDate(start),
          endTime: Timestamp.fromDate(end),
          userId: user.uid,
          userEmail: user.email,
          createdAt: Timestamp.now(),
        });
      } else if (mode === "edit" && editBooking) {
        const start = combineDateAndTime(editBooking.startTime?.toDate(), startTime);
        const end = combineDateAndTime(editBooking.startTime?.toDate(), endTime);

        if (end <= start) throw new Error("End time must be after start time");

        await updateDoc(doc(db, "bookings", editBooking.id), {
          title,
          startTime: Timestamp.fromDate(start),
          endTime: Timestamp.fromDate(end),
        });
      }

      setTitle("");
      setStartTime("");
      setEndTime("");
      onClose();
    } catch (err) {
      setError(err.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const dateLabel =
    mode === "edit"
      ? editBooking.startTime?.toDate()?.toLocaleDateString()
      : selectedSlot?.start?.toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{mode === "edit" ? "Edit Meeting" : "Book a Room"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Meeting Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Start Time</label>
              <input
                type="time"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">End Time</label>
              <input
                type="time"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Selected Date: {dateLabel}</p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? (mode === "edit" ? "Saving..." : "Booking...") : (mode === "edit" ? "Save Changes" : "Confirm Booking")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
