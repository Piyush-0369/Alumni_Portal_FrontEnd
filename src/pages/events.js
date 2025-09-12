import { useEffect, useState } from "react";
import EventList from "../events/EventList";
import { fetchWithRefresh } from "../utils/fetchWithRefresh"; // refresh token utility

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetchWithRefresh(
          "http://localhost:4000/api/v1/baseUsers/getAllEvents",
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        console.log("Events API response:", data);

        setEvents(Array.isArray(data?.data?.events) ? data.data.events : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>

      {/* Page content */}
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200 p-6">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          All Events
        </h1>
        <EventList events={events} />
        
      </div>
    </>
    
  );
};

export default EventsPage;
