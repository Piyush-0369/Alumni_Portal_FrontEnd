import Navbar from "../components/ui/Navbar";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Admin functionalities will be here.</p>
      </main>
    </div>
  );
}
