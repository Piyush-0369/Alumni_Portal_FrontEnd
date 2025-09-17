import { useEffect, useState } from "react";
import AdminDashboard from "../dashboard/AdminDashboard";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

const BASE_URL = "http://localhost:4000/api/v1/baseUsers";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithRefresh(`${BASE_URL}/getProfile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        if (data.success && data.data.role === "Admin") {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
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
