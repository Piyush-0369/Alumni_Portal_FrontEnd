import { useState } from "react";
import EditEventModal from "./EditEventModal";

const EventCard = ({ event, onUpdated }) => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-72 flex flex-col">
        {event.banner && (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-36 object-cover"
          />
        )}

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-emerald-800 mb-1 line-clamp-1">
              {event.title}
            </h2>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="text-xs text-gray-700 space-y-1">
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-2 w-full bg-amber-500 text-white py-1 rounded hover:bg-amber-600 text-sm"
          >
            Update Event
          </button>
        </div>
      </div>

      {editing && (
        <EditEventModal
          event={event}
          onClose={() => setEditing(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
};

export default EventCard;
