import { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch {
        console.error("Failed to parse userData");
        setUserData({ error: "Invalid stored data" });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/"; // redirect to login
  };

  return (
    <div className="min-h-screen bg-slate-500">
      <Navbar />
      <main className="p-8 text-black flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Alumni Profile</h2>

        {!userData && (
          <p className="text-white">This is where alumni details will be displayed.</p>
        )}

        {userData?.error && (
          <div className="max-w-md bg-red-200 p-4 rounded shadow text-center">
            <h3 className="text-xl font-bold mb-2">Login Failed</h3>
            <p>{userData.error}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Go Back
            </button>
          </div>
        )}

        {userData && !userData.error && (
          <div className="max-w-lg w-full bg-white p-6 rounded shadow flex flex-col items-center">
            {userData?.avatar && (
              <img
                src={userData.avatar}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-4 text-center">
              Welcome, {userData?.first_name} {userData?.last_name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Role:</strong> {userData?.role}</p>
              <p><strong>Batch Year:</strong> {userData?.batch_year}</p>
              <p><strong>Degree:</strong> {userData?.degree}</p>
              <p><strong>Department:</strong> {userData?.department}</p>
            </div>

            <button
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
