import { useState } from "react";

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
      <input
        type="date"
        className="w-full border p-2 rounded"
        required
      />
      <input 
      type="text" 
      placeholder="Event Location" 
      className="w-full border p-2 rounded">
      </input>
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

// Verify alumni (mock for now)
const VerifyAlumni = () => {
  const pending = [
    { id: 3, name: "Sneha Gupta", batch: 2023 },
    { id: 4, name: "Arjun Patel", batch: 2020 },
  ];

  const handleVerify = (id) => {
    alert(`Alumni with ID ${id} verified (hook to backend later)`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verify Alumni</h2>
      {pending.length === 0 ? (
        <p>No pending alumni to verify.</p>
      ) : (
        <ul className="space-y-2">
          {pending.map((alum) => (
            <li
              key={alum.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <span>
                {alum.name} — Batch {alum.batch}
              </span>
              <button
                onClick={() => handleVerify(alum.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
