import { useState, useEffect } from "react";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200 
                p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-emerald-900 tracking-tight drop-shadow-sm">
        Admin Dashboard
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        {[
          { id: "events", label: "Create Event" },
          { id: "verify", label: "Verify Alumni" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-amber-400 text-white shadow-md"
                : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-emerald-100">
        {activeTab === "events" && <EventForm />}
        {activeTab === "verify" && <VerifyAlumni />}
      </div>
    </div>
  );
};

// Event creation form
const EventForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target); // collects all fields

    try {
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/admins/createEvent", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Failed to create event");
      }

      alert("✅ Event created successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
        Create a New Event
      </h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Event Description"
        rows="4"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      ></textarea>

      {/* Date */}
      <input
        type="date"
        name="date"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />

      {/* Time */}
      <input
        type="time"
        name="time"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />

      {/* Location */}
      <input
        type="text"
        name="location"
        placeholder="Event Location"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />

      {/* Banner Image */}
      <input
        type="file"
        name="banner"
        accept="image/*"
        className="w-full border border-emerald-200 bg-white/60 p-3 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 transition
                   file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                   file:border-0 file:text-sm file:font-semibold 
                   file:bg-amber-400 file:text-white hover:file:bg-amber-500"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 text-white px-4 py-2 rounded-lg 
                   font-semibold shadow-md hover:bg-amber-500 transition-colors 
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

// Verify Alumni (with updated Verify button)
const VerifyAlumni = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchPendingAlumni = async () => {
      try {
        const response = await fetchWithRefresh(
          "http://localhost:4000/api/v1/admins/pending-approvalAlumni",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData?.message || "Failed to fetch pending alumni");
        }

        const data = await response.json();
        setPending(data?.data?.[0]?.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAlumni();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setProcessing(id + action);

      const endpoint =
        action === "verify" ? "verify-Alumni" : "deny-Alumni";

      const options =
        action === "verify"
          ? {
            method: "POST", // backend expects POST for verify
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alumni_id: id }),
            credentials: "include",
          }
          : {
            method: "DELETE", // backend expects DELETE for deny
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alumni_id: id }), // backend expects "alumni"
            credentials: "include",
          };

      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/admins/${endpoint}`,
        options
      );

      if (res.ok) {
        alert(
          action === "verify"
            ? "Alumni verified successfully!"
            : "Alumni denied successfully!"
        );
        setPending((prev) => prev.filter((alum) => alum._id !== id));
      } else {
        const errData = await res.json();
        alert(errData?.message || `Failed to ${action} alumni`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error while trying to ${action} alumni`);
    } finally {
      setProcessing(null);
    }
  };


  if (loading) return <p>Loading pending alumni...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (pending.length === 0) return <p>No pending alumni to verify.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
        Verify Alumni
      </h2>
      <ul className="space-y-2">
        {pending.map((alum) => (
          <li
            key={alum._id}
            className="p-3 border rounded-lg shadow-sm flex justify-between items-center bg-emerald-50"
          >
            <span>
              {alum.first_name} {alum.middle_name || ""} {alum.last_name} — Batch{" "}
              {alum.batch_year}
            </span>
            <div className="flex gap-2">
              {/* Verify button */}
              <button
                onClick={() => handleAction(alum._id, "verify")}
                disabled={processing === alum._id + "verify"}
                className={`px-3 py-1 rounded-lg text-white font-semibold shadow-md transition 
                  ${processing === alum._id + "verify"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black"
                  }`}
              >
                {processing === alum._id + "verify" ? "Verifying..." : "Verify"}
              </button>

              {/* Deny button */}
              <button
                onClick={() => handleAction(alum._id, "deny")}
                disabled={processing === alum._id + "deny"}
                className={`px-3 py-1 rounded-lg text-white font-medium ${processing === alum._id + "deny"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                  } transition`}
              >
                {processing === alum._id + "deny" ? "Denying..." : "Deny"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
