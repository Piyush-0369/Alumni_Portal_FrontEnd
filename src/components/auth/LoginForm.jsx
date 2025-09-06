import { useState } from "react";
import { useRouter } from "next/router"; 
import Button from "../ui/Button";

const LoginForm = () => {
  const [role, setRole] = useState("");       // role: student/alumni
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");         // for OTP entry
  const [showOtp, setShowOtp] = useState(false); // toggle OTP field
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!showOtp) {
      // Later: call backend here to send OTP
      setShowOtp(true); // show OTP field after first login attempt
    } else {
      // Step 2: Validate OTP
      alert(`OTP entered: ${otp}`);
      // Later: verify OTP with backend
      router.push("/profile");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-10 bg-slate-500 p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {/* Role Dropdown (only student & alumni) */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="alumni">Alumni</option>
      </select>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {/* OTP Field (only shown after first login attempt) */}
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

      <Button type="submit">{showOtp ? "Verify OTP" : "Login"}</Button>
    </form>
  );
};

export default LoginForm;
