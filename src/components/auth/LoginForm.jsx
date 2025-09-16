import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../ui/Button";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";

const BASE_URL = "http://localhost:4000/api/v1/baseUsers";

const LoginForm = () => {
  const [role, setRole] = useState("");       
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetchWithRefresh(`${BASE_URL}/getProfile`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            router.replace("/profile"); // Already logged in
          }
        }
      } catch {
        // Not logged in, do nothing
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!role || !email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    try {
      const res = await fetchWithRefresh(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
        credentials: "include",
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setErrorMsg("Unexpected response from server");
        return;
      }

      if (res.ok && data.success) {
        // Force a full reload so Navbar picks up session cookies
        window.location.href = "/profile";
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full p-6 bg-[var(--color-surface)] rounded-2xl shadow-soft-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/20 to-emerald-200/20 pointer-events-none rounded-2xl" />
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Log in</h2>

        {errorMsg && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{errorMsg}</div>
        )}

        {/* Role selector */}
        <div className="flex justify-center gap-4 mb-6">
          {["Student", "Alumni", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg font-medium transition 
                ${role === r
                  ? "bg-amber-400 text-white shadow-md"
                  : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          required
        />

        <Button
          type="submit"
          className="w-full bg-amber-400 text-white hover:bg-amber-500 transition-colors"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
