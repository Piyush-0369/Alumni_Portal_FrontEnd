// src/events/EventList.jsx
import EventCard from "./EventCard";

const EventList = ({ events }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return <p className="text-center text-gray-500">No events available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
