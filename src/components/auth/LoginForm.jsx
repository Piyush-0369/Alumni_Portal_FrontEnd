import { useState } from "react";
import { useRouter } from "next/router"; 
import Button from "../ui/Button";

const BASE_URL = "http://localhost:4000/api/v1/baseUsers"; // backend endpoint

const LoginForm = () => {
  const [role, setRole] = useState("");       
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [otp, setOtp] = useState("");         
  // const [showOtp, setShowOtp] = useState(false); 
  const [errorMsg, setErrorMsg] = useState(""); // error state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // reset error on each attempt

    console.log("Attempting login with:", { role, email, password });

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      const text = await res.text(); // get raw response
      console.log("Raw response from backend:", text);

      let data;
      try {
        data = JSON.parse(text); // attempt to parse JSON
      } catch (err) {
        console.error("Backend returned non-JSON response:", text);
        setErrorMsg("Unexpected response from server");
        return;
      }

      if (res.ok && data.success) {
        console.log("Login successful, storing userData...");
        localStorage.setItem("userData", JSON.stringify(data.data));
        router.push("/profile"); // redirect only on success
      } else {
        console.warn("Login failed:", data.message);
        setErrorMsg(data.message || "Invalid credentials"); // show error on form
      }

    } catch (err) {
      console.error("Network or fetch error:", err);
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-10 bg-slate-500 p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{errorMsg}</div>
      )}

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="">Select Role</option>
        <option value="Student">Student</option>
        <option value="Alumni">Alumni</option>
      </select>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {/* OTP Field (commented for now) */}
      {/*
      {showOtp && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
      )}
      */}

      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
