import Navbar from "../components/ui/Navbar";
import AdminDashboard from "../dashboard/AdminDashboard";

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-500">
      <Navbar />
    <main>
      <AdminDashboard />
    </main>
    </div>
    
  );
}
