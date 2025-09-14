import EventCard from "./EventCard";

const EventList = ({ events, setEvents }) => {
  const handleEventUpdated = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
  };

  return (
    <div className="flex flex-wrap gap-6 w-full">
      {events.map((event) => (
        <div
          key={event._id}
          className="w-full sm:w-1/2 lg:w-1/3"
        >
          <EventCard event={event} onUpdated={handleEventUpdated} />
        </div>
      ))}
    </div>
  );
};

export default EventList;
