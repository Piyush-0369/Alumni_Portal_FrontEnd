// src/events/EventCard.jsx
const EventCard = ({ event }) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-emerald-100 
                 rounded-2xl shadow-md overflow-hidden 
                 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
                 h-80 flex flex-col"
    >
      {/* Banner Image */}
      {event.banner && (
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-40 object-cover rounded-t-2xl"
        />
      )}

      {/* Event Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-emerald-900 mb-1 line-clamp-1">
            {event.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 leading-snug line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="text-xs text-emerald-800 space-y-1 font-medium">
          <p className="flex items-center gap-1">
            📅 <span>{new Date(event.date).toLocaleDateString()}</span>
          </p>
          <p className="flex items-center gap-1">
            📍 <span>{event.location}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
