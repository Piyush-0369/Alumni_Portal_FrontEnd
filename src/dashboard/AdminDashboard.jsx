import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 rounded ${
            activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Create Event
        </button>
        <button
          onClick={() => setActiveTab("alumni")}
          className={`px-4 py-2 rounded ${
            activeTab === "alumni" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Check Alumni
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-4 py-2 rounded ${
            activeTab === "verify" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Verify Alumni
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "events" && <EventForm />}
        {activeTab === "alumni" && <AlumniList />}
        {activeTab === "verify" && <VerifyAlumni />}
      </div>
    </div>
  );
};

// Form to create events
const EventForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Event created (hook this to backend later)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create a New Event</h2>
      <input
        type="text"
        placeholder="Event Title"
        className="w-full border p-2 rounded"
        required
      />
      <input type="date" className="w-full border p-2 rounded" required />
      <input
        type="text"
        placeholder="Event Location"
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Event Description"
        className="w-full border p-2 rounded"
        required
      ></textarea>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>
    </form>
  );
};

// List of alumni (mock for now)
const AlumniList = () => {
  const alumni = [
    { id: 1, name: "Piyush Sharma", batch: 2022 },
    { id: 2, name: "Rohit Mehra", batch: 2021 },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Alumni</h2>
      <ul className="space-y-2">
        {alumni.map((alum) => (
          <li key={alum.id} className="p-3 border rounded">
            {alum.name} — Batch {alum.batch}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Verify alumni (real API call)
const VerifyAlumni = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null); // Track which alumni is being verified

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
        console.error("Error fetching pending alumni:", err);
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
      <h2 className="text-xl font-semibold mb-4">Verify Alumni</h2>
      <ul className="space-y-2">
        {pending.map((alum) => (
          <li
            key={alum._id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <span>
              {alum.first_name} {alum.middle_name || ""} {alum.last_name} — Batch{" "}
              {alum.batch_year}
            </span>
            <button
              onClick={() => handleVerify(alum._id)}
              disabled={verifying === alum._id}
              className={`px-3 py-1 rounded text-white ${
                verifying === alum._id ? "bg-gray-400" : "bg-blue-500"
              }`}
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
