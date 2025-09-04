import Navbar from "../components/ui/Navbar";

export default function Events() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">Events</h2>

        {/* Add your components here */}
        <div>
          {/* Example: <EventList /> or <EventCard /> */}
        </div>
      </main>
    </div>
  );
}
