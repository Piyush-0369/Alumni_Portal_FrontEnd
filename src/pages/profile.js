import Navbar from "../components/ui/Navbar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-4">Alumni Profile</h2>
        <p>This is where alumni details will be displayed.</p>
      </main>
    </div>
  );
}
