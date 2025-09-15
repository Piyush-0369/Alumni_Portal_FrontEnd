import EventCard from "./EventCard";

const EventList = ({ events, setEvents, userRole }) => {
  const handleEventUpdated = (updatedEvent) => {
    if (!updatedEvent || typeof setEvents !== "function") return;
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
  };

  const handleEventDeleted = (deletedId) => {
    if (!deletedId) return;
    setEvents((prev) => prev.filter((ev) => ev._id !== deletedId));
  };

  return (
    <div className="flex flex-wrap gap-6 w-full">
      {events.map((event) => (
        <div key={event._id} className="w-full sm:w-1/2 lg:w-1/3">
          <EventCard
            event={event}
            userRole={userRole} // ✅ pass role down
            onUpdated={handleEventUpdated}
            onDeleted={handleEventDeleted}
          />
        </div>
      ))}
    </div>
  );
};

export default EventList;
