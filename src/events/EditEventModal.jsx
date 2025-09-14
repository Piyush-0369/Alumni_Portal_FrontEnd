// src/events/EditEventModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

const EditEventModal = ({ event, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    date: event.date || "",
    time: event.time || "",
    location: event.location || "",
    mode: event.mode || "",
    organizer: event.organizer || "",
    speaker: event.speaker || "",
    tags: event.tags ? event.tags.join(", ") : "",
    status: event.status || "Upcoming",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/baseUsers/updateEvent/${event._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            tags: formData.tags.split(",").map((t) => t.trim()),
          }),
        }
      );

      // Always read JSON/text regardless of res.ok
      const data = await res.json().catch(async () => ({ message: await res.text() }));

      if (!res.ok) {
        console.error("Update failed:", res.status, data);
        alert(`Failed to update event: ${data.message || "Unknown error"}`);
        return; // stop further execution
      }

      // Only call onUpdated if it is a function
      if (typeof onUpdated === "function" && data?.data) {
        onUpdated(data.data);
      }
      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Error updating event");
    }
  };


  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/baseUsers/deleteEvent/${event._id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to delete event");

      alert("Event deleted successfully");
      onClose();
      // Instead of calling onUpdated(null), use a separate callback for deletion
      if (typeof onDeleted === "function") {
        onDeleted(event._id);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Error deleting event");
    }
  };

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative"
          >
            <h2 className="text-2xl font-bold mb-4 text-emerald-700">
              Edit Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date.split("T")[0]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                placeholder="Mode (Online/Offline)"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Organizer"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleChange}
                placeholder="Speaker"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Action buttons */}
              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 px-4 py-2 bg-amber-400 text-black rounded-lg"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="w-1/3 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-1/3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditEventModal;
