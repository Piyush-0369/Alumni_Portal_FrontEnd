const EventCard = ({ event, userRole, onEdit, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full">
      {/* Image area */}
      <div className="h-25 w-full flex-none bg-gray-100 overflow-hidden relative">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title || "Event banner"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Content */}
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
            onClick={() => onView(event)}
            className="flex-1 px-6 py-2 bg-amber-400 text-black rounded-lg"
          >
            View Details
          </button>

          {userRole === "Admin" && (
            <button
              onClick={() => onEdit(event)}
              className="flex-1 bg-amber-500 text-white py-2 rounded hover:bg-amber-600 text-sm"
            >
              Update Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
