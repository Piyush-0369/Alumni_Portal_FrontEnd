// src/events/EventDetailsModal.jsx
import { motion, AnimatePresence } from "framer-motion";

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
          >
            {/* Modal content wrapper with padding */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Event title */}
              <h2 className="text-3xl font-bold text-emerald-700 mb-4">
                {event.title}
              </h2>

              {/* Event details */}
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                {event.time && (
                  <p className="text-gray-600">
                    <strong>Time:</strong> {event.time}
                  </p>
                )}
                <p className="text-gray-600">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-gray-600">
                  <strong>Mode:</strong> {event.mode}
                </p>

                {event.organizer && (
                  <p className="text-gray-600">
                    <strong>Organizer:</strong> {event.organizer}
                  </p>
                )}
                {event.speaker && (
                  <p className="text-gray-600">
                    <strong>Speaker:</strong> {event.speaker}
                  </p>
                )}

                {event.tags && event.tags.length > 0 && (
                  <p className="text-gray-600">
                    <strong>Tags:</strong> {event.tags.join(", ")}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-800 whitespace-pre-line flex-1">
                {event.description}
              </p>
            </div>

            {/* Close button at the bottom */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full px-6 py-2 bg-amber-400 text-black rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
