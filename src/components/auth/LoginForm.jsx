import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../ui/Button";

const BASE_URL = "http://localhost:4000/api/v1/baseUsers";

const LoginForm = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    console.log("Attempting login with:", { role, email, password });

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
        credentials: "include",
      });

      const text = await res.text();
      console.log("Raw response from backend:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Backend returned non-JSON response:", text);
        setErrorMsg("Unexpected response from server");
        return;
      }

      if (res.ok && data.success) {
        console.log("Login successful, storing userData...");
        localStorage.setItem("userData", JSON.stringify(data.data));
        router.push("/profile");
      } else {
        console.warn("Login failed:", data.message);
        setErrorMsg(data.message || "Invalid credentials");
      }

    } catch (err) {
      console.error("Network or fetch error:", err);
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-2 bg-secondary">
        <h2 className="text-xl font-bold text-white text-center">AlumniConnect</h2>
      </div>

      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center mb-3">
            <i className="fas fa-user-graduate text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-secondary">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your alumni account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>
          )}

          <div>
            <label htmlFor="role" className="block text-gray-700 mb-2 font-medium">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center">
            <i className="fab fa-facebook-f mr-2"></i> Facebook
          </button>
          <button className="py-2.5 px-4 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg transition duration-300 flex items-center justify-center">
            <i className="fab fa-google mr-2"></i> Google
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;