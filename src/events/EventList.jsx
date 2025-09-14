import EventCard from "./EventCard";

const EventList = ({ events, setEvents }) => {
  const handleEventUpdated = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onUpdated={handleEventUpdated} />
      ))}
    </div>
  );
};

export default EventList;
