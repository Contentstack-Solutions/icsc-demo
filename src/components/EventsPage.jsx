"use client";

import { useState, useEffect } from "react";


function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function AttendeeRow({ attendee }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <img
        src={attendee.avatar_url}
        alt={attendee.name}
        className="w-14 h-14 rounded-full object-cover bg-gray-100 flex-shrink-0"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{attendee.name}</p>
        {attendee.title && (
          <p className="text-xs text-gray-500 truncate">{attendee.title}</p>
        )}
        {attendee.company && (
          <p className="text-xs text-gray-400 truncate">{attendee.company}</p>
        )}
        <span className="text-xs text-[#246EFF] cursor-pointer mt-0.5 inline-block">
          Schedule an Appointment
        </span>
      </div>
    </div>
  );
}

function AttendeeRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-28 bg-gray-200 rounded" />
        <div className="h-2.5 w-20 bg-gray-100 rounded" />
        <div className="h-2.5 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default function EventsPage({ entry }) {
  const [attendeesMap, setAttendeesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [collapsedEvents, setCollapsedEvents] = useState({});

  const toggleCollapse = (uid) =>
    setCollapsedEvents((prev) => ({ ...prev, [uid]: !prev[uid] }));

  const events = entry?.events || [];

  useEffect(() => {
    if (!events.length) {
      setLoading(false);
      return;
    }

    async function fetchAllAttendees() {
      setLoading(true);
      const results = await Promise.all(
        events.map(async (event) => {
          const supabaseEventId = event.supabase?.id;
          if (!supabaseEventId) return { uid: event.uid, attendees: [] };
          try {
            const res = await fetch(`/api/supabase/attendees?event_id=${supabaseEventId}`);
            if (!res.ok) return { uid: event.uid, attendees: [] };
            const data = await res.json();
            return { uid: event.uid, attendees: Array.isArray(data) ? data : [] };
          } catch {
            return { uid: event.uid, attendees: [] };
          }
        })
      );

      const map = {};
      for (const { uid, attendees } of results) {
        map[uid] = attendees;
      }
      setAttendeesMap(map);
      setLoading(false);
    }

    fetchAllAttendees();
  }, [entry]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full bg-[#246EFF] px-8 py-10">
        <h1 className="text-3xl font-bold text-white">My ICSC Events</h1>
      </div>

      {/* Events grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {events.length === 0 && (
          <p className="text-gray-500 text-center py-20">No events found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const attendees = attendeesMap[event.uid];
            const isEventLoading = loading || attendees === undefined;
            const isCollapsed = !!collapsedEvents[event.uid];

            return (
              <div
                key={event.uid}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col"
              >
                {/* Event info — flex-1 so it fills space when attendees are collapsed */}
                <div className="flex-1">
                  <h2
                    className={`font-bold text-gray-900 mb-1 transition-all duration-300 ${isCollapsed ? 'text-2xl' : 'text-lg'}`}
                  >
                    {event.title}
                  </h2>
                  {event.date && (
                    <p
                      className={`font-medium text-[#246EFF] mb-2 transition-all duration-300 ${isCollapsed ? 'text-base' : 'text-sm'}`}
                    >
                      {formatEventDate(event.date)}
                    </p>
                  )}
                  {event.description && (
                    <p
                      className={`text-gray-500 leading-relaxed transition-all duration-300 ${isCollapsed ? 'text-base' : 'text-sm'}`}
                    >
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Attendees section — mt-auto pins it to the bottom of the card */}
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <button
                    onClick={() => toggleCollapse(event.uid)}
                    className="flex items-center gap-1.5 mb-1 group"
                  >
                    <p className="text-sm font-semibold text-gray-800">Members Attending</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    >
                      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isCollapsed ? '0fr' : '1fr',
                      transition: 'grid-template-rows 300ms ease',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      {isEventLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <AttendeeRowSkeleton key={i} />
                          ))}
                        </div>
                      ) : attendees.length === 0 ? (
                        <p className="text-sm text-gray-400 py-3">No attendees found</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                          {attendees.map((attendee) => (
                            <AttendeeRow key={attendee.id} attendee={attendee} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
