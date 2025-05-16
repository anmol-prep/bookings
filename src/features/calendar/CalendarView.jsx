import React, { useEffect, useRef } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useBookingStore } from "../../store/bookingStore";
import { useStore } from "../../store/useStore";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function CalendarView({ onDateSelect, onEventEdit }) {
  const calendarRef = useRef(null);
  const { user } = useStore();
  const { bookings, subscribeToBookings } = useBookingStore();
  const calendarInstance = useRef(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    calendarInstance.current = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      selectable: true,
      selectMirror: true,
      editable: true,
      select: (arg) => onDateSelect(arg),
      eventClick: (clickInfo) => {
        const booking = bookings.find(b => b.id === clickInfo.event.id);
        if (booking && booking.userId === user?.uid) {
          onEventEdit(booking);
        }
      },
      eventChange: async (changeInfo) => {
        const event = changeInfo.event;
        const booking = bookings.find(b => b.id === event.id);

        if (!booking || booking.userId !== user?.uid) {
          event.revert();
          alert("You can only edit your own bookings.");
          return;
        }

        try {
          await updateDoc(doc(db, "bookings", event.id), {
            startTime: Timestamp.fromDate(event.start),
            endTime: Timestamp.fromDate(event.end),
          });
        } catch (error) {
          event.revert();
          alert("Failed to save changes. Try again.");
        }
      },
      events: bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: booking.startTime?.toDate(),
        end: booking.endTime?.toDate(),
        backgroundColor: booking.userId === user?.uid ? '#4f46e5' : '#10b981',
        extendedProps: {
          userId: booking.userId
        }
      })),
      height: 600,
    });

    calendarInstance.current.render();
    const unsubscribe = subscribeToBookings();

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (calendarInstance.current) {
      calendarInstance.current.removeAllEvents();
      calendarInstance.current.addEventSource(
        bookings.map(booking => ({
          id: booking.id,
          title: booking.title,
          start: booking.startTime?.toDate(),
          end: booking.endTime?.toDate(),
          backgroundColor: booking.userId === user?.uid ? '#4f46e5' : '#10b981',
          extendedProps: {
            userId: booking.userId
          }
        }))
      );
    }
  }, [bookings, user?.uid]);

  return <div ref={calendarRef} className="h-[600px] bg-white rounded-lg shadow-md p-4" />;
}
