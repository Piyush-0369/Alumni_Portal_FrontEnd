import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import EventList from "../events/EventList";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("all"); // all, online, offline
  const [dateFilter, setDateFilter] = useState("all"); // all, upcoming, past

  const [openDropdown, setOpenDropdown] = useState(null); // "date" | "mode" | null

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetchWithRefresh(
          "http://localhost:4000/api/v1/baseUsers/getAllEvents",
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const eventsList = Array.isArray(data?.data?.events) ? data.data.events : [];
        setEvents(eventsList);
        setFilteredEvents(eventsList);
      } catch (err) {
        setError("Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // filtering logic
  useEffect(() => {
    let result = [...events];
    const now = new Date();

    if (mode !== "all") {
      result = result.filter((e) => {
      const eventMode = (e.mode || "").toLowerCase(); // normalize
      return mode === "online" ? eventMode === "online" : eventMode === "offline";
      });
    }

    if (dateFilter !== "all") {
      result = result.filter((e) => {
        const eventDate = new Date(e.date);
        return dateFilter === "upcoming" ? eventDate >= now : eventDate < now;
      });
    }

    setFilteredEvents(result);
  }, [mode, dateFilter, events]);

  if (loading) return <p className="text-center text-gray-600">Loading events...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header with filter buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">All Events</h1>

        <div className="flex gap-4">
          {/* Sort by Date */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
              className="flex items-center gap-2 bg-white border border-emerald-400 px-3 py-2 rounded-lg shadow hover:bg-emerald-100 transition"
            >
              Sort by Date <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "date" && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-emerald-200 z-10">
                {["all", "upcoming", "past"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-emerald-50 ${
                      dateFilter === opt ? "bg-amber-200 font-medium" : ""
                    }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by Mode */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "mode" ? null : "mode")}
              className="flex items-center gap-2 bg-white border border-emerald-400 px-3 py-2 rounded-lg shadow hover:bg-emerald-100 transition"
            >
               Mode <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "mode" && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-emerald-200 z-10">
                {["all", "online", "offline"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setMode(opt);
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-emerald-50 ${
                      mode === opt ? "bg-amber-200 font-medium" : ""
                    }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event List */}
      <EventList events={filteredEvents} />
    </motion.div>
  );
};

export default EventsPage;