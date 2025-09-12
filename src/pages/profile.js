import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse userData:", err);
        setUserData({ error: "Invalid stored data" });
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetchWithRefresh("http://localhost:4000/api/v1/baseUsers/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("userData");
        window.location.href = "/";
      } else {
        const err = await response.json();
        alert("Logout failed: " + (err?.message || "Please try again"));
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error connecting to server.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-200 to-mint-200 flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200">
      <main className="p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Profile</h2>

        {/* No data */}
        {!userData && (
          <p className="text-gray-800">This is where profile details will be displayed.</p>
        )}

        {/* Error case */}
        {userData?.error && (
          <div className="max-w-md bg-red-200 p-6 rounded-2xl shadow text-center">
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

        {/* Success case */}
        {userData && !userData.error && (
          <div className="max-w-lg w-full bg-peach-50/90 p-8 rounded-2xl shadow flex flex-col items-center">
            {userData?.avatar && (
              <img
                src={userData.avatar}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full mb-4"
              />
            )}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Welcome, {userData.first_name}{" "}
              {userData.middle_name && `${userData.middle_name} `} 
              {userData.last_name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>Batch Year:</strong> {userData.batch_year}</p>
            </div>

            {userData.role === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <p><strong>College Roll:</strong> {userData.college_roll}</p>
                <p><strong>Course:</strong> {userData.course}</p>
                <p><strong>Branch:</strong> {userData.branch}</p>
              </div>
            )}

            {userData.role === "alumni" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <p><strong>Degree:</strong> {userData.degree}</p>
                <p><strong>Department:</strong> {userData.department}</p>
              </div>
            )}

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
