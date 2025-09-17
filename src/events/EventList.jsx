import EventCard from "./EventCard";

const EventList = ({ events, userRole, onEdit, onView }) => {
  return (
    <div className="flex flex-wrap gap-6 w-full">
      {events.map((event) => (
        <div key={event._id} className="w-full sm:w-1/2 lg:w-1/3">
          <EventCard
            event={event}
            userRole={userRole}
            onEdit={onEdit}
            onView={onView}
          />
        </div>
      ))}
    </div>
  );
};

export default EventList;
