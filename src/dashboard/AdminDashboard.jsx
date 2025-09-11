import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-800">
        Admin Dashboard
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          { id: "events", label: "Create Event" },
          { id: "verify", label: "Verify Alumni" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
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
      <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
        {activeTab === "events" && <EventForm />}
        {activeTab === "verify" && <VerifyAlumni />}
      </div>
    </div>
  );
};

// Event creation form
const EventForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Event created (hook this to backend later)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-2">
        Create a New Event
      </h2>
      <input
        type="text"
        placeholder="Event Title"
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />
      <input
        type="date"
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      />
      <input
        type="text"
        placeholder="Event Location"
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      />
      <textarea
        placeholder="Event Description"
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        required
      ></textarea>
      <button
        type="submit"
        className="bg-amber-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
      >
        Create Event
      </button>
    </form>
  );
};

// Verify Alumni
const VerifyAlumni = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    const fetchPendingAlumni = async () => {
      try {
        const response = await fetch(
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

  const handleVerify = async (id) => {
    try {
      setVerifying(id);
      const res = await fetch(
        `http://localhost:4000/api/v1/admins/verify-Alumni`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alumni_id: id }),
          credentials: "include",
        }
      );

      if (res.ok) {
        alert("Alumni verified successfully!");
        setPending((prev) => prev.filter((alum) => alum._id !== id));
      } else {
        const errData = await res.json();
        alert(errData?.message || "Failed to verify alumni");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying alumni");
    } finally {
      setVerifying(null);
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
            <button
              onClick={() => handleVerify(alum._id)}
              disabled={verifying === alum._id}
              className={`px-3 py-1 rounded-lg text-white font-medium ${
                verifying === alum._id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500"
              } transition`}
            >
              {verifying === alum._id ? "Verifying..." : "Verify"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
