import { useState } from "react";
import EditEventModal from "./EditEventModal";
import EventDetailsModal from "./EventDetailsModal";

const EventCard = ({ event, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-96">
        <div className="h-40 w-full flex-none bg-gray-100 flex items-center justify-center overflow-hidden">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title || "Event banner"}
              className="max-h-full max-w-full object-contain block"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="text-gray-400 text-sm">No image</div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-emerald-800 mb-2 line-clamp-1">
            {event.title}
          </h2>

          <div className="text-sm md:text-base text-gray-700 space-y-1 mb-4 flex-1">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {event.time && <p><strong>Time:</strong> {event.time}</p>}
            <p><strong>Location:</strong> {event.location}</p>
          </div>

          <div className="mt-auto flex gap-2">
            <button
              onClick={() => setViewing(true)}
              className="flex-1 px-6 py-2 bg-amber-400 text-black rounded-lg"
            >
              View Details
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-amber-500 text-white py-2 rounded hover:bg-amber-600 text-sm"
            >
              Update Event
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <EditEventModal
          event={event}
          onClose={() => setEditing(false)}
          onUpdated={onUpdated}
          onDeleted={onDeleted} // pass delete callback
        />
      )}
      {viewing && <EventDetailsModal event={event} onClose={() => setViewing(false)} />}
    </>
  );
};

export default EventCard;
