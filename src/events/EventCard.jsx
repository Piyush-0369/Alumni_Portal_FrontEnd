// src/events/EventCard.jsx
const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-72 flex flex-col">
      {/* Banner Image */}
      {event.banner && (
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-36 object-cover"
        />
      )}

      {/* Event Info */}
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
      </div>
    </div>
  );
};

export default EventCard;
