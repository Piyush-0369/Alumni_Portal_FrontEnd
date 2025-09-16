import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchWithRefresh";

const BASE_URL = "http://localhost:4000/api/v1/baseUsers";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async (redirectToLogin = false) => {
    try {
      await fetchWithRefresh(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Server logout failed, clearing client session anyway", error);
    } finally {
      document.cookie = "accessToken=; Max-Age=0; path=/;";
      document.cookie = "refreshToken=; Max-Age=0; path=/;";
      window.location.href = redirectToLogin ? "/LoginForm" : "/";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithRefresh(`${BASE_URL}/getProfile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          // 🚨 Invalid/expired cookies → logout → /login
          await handleLogout(true);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
        } else {
          // 🚨 Backend says not valid → logout → /login
          await handleLogout(true);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        await handleLogout(true); // 🚨 Any error → /login
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetchWithRefresh(`${BASE_URL}/deleteAccount`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Your account has been deleted.");
        await handleLogout(true); // go back to login after deletion
      } else {
        let errMsg = "Please try again";
        try {
          const err = await response.json();
          errMsg = err?.message || errMsg;
        } catch {}
        alert("Failed to delete account: " + errMsg);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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

        {/* Admin case */}
        {userData?.role === "Admin" && (
          <div className="max-w-lg w-full bg-emerald-100 p-8 rounded-2xl shadow flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Admin
            </h3>
            <button
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleLogout(true)}
            >
              Logout
            </button>
          </div>
        )}

        {/* Student / Alumni case */}
        {userData && userData.role !== "Admin" && (
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

            {userData.role === "Student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <p><strong>College Roll:</strong> {userData.college_roll}</p>
                <p><strong>Course:</strong> {userData.course}</p>
                <p><strong>Branch:</strong> {userData.branch}</p>
              </div>
            )}

            {userData.role === "Alumni" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <p><strong>Degree:</strong> {userData.degree}</p>
                <p><strong>Department:</strong> {userData.department}</p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleLogout(true)}
              >
                Logout
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}