// src/components/events/EventCard.jsx

import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 border border-emerald-200 transition hover:shadow-xl">
      <h3 className="text-xl font-semibold text-emerald-800 mb-2">
        {event.title}
      </h3>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Date:</span>{" "}
        {new Date(event.date).toLocaleDateString()}
      </p>
      {event.location && (
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Location:</span> {event.location}
        </p>
      )}
      <p className="text-gray-700">{event.description}</p>
    </div>
  );
};

export default EventCard;
