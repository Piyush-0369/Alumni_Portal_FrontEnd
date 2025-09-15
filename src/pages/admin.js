import { useEffect, useState } from "react";
import AdminDashboard from "../dashboard/AdminDashboard";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-500">
      <main>
        <AdminDashboard />
      </main>
    </div>
  );
}
