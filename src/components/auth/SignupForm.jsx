import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";

export default function SignupForm() {
  const router = useRouter();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    password: "",
    college_roll: "",
    batch_year: "",
    course: "",
    branch: "",
    degree: "",
    department: "",
    avatar: null,
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    if (role === "Student" && !email.endsWith("@college.edu")) {
      alert("Please use your valid college email ID");
      return;
    }

    try {
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to " + email);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    try {
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setVerified(true);
        alert("✅ Email verified successfully!");
      } else {
        alert(data.message || "❌ OTP verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert("Please verify your email before signing up.");
      return;
    }
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSend = new FormData();
    Object.entries({ ...formData, email }).forEach(([key, value]) => {
      if (value) {
        dataToSend.append(key === "password" ? "password_hash" : key, value);
      }
    });

    const url =
      role === "Student"
        ? "http://localhost:4000/api/v1/students/registerStudent"
        : "http://localhost:4000/api/v1/alumni/registerAlumni";

    try {
      const res = await fetchWithRefresh(url, { method: "POST", body: dataToSend });
      const data = await res.json();
      if (res.ok) {
        router.push("/LoginForm");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
    >
      {/* Role selector */}
      <div className="flex justify-center gap-4 mb-6">
        {["Student", "Alumni"].map((r) => (
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

      {/* Email + Verify */}
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={verified}
          className="flex-1 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
          required
        />
        {!verified && (
          <button
            type="button"
            onClick={handleSendOtp}
            className="px-4 py-2 rounded-lg bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-colors"
          >
            {otpSent ? "Resend OTP" : "Verify Email"}
          </button>
        )}
      </div>

      {/* OTP Field */}
      {otpSent && !verified && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="flex-1 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* Names */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {["first_name", "middle_name", "last_name"].map((field, idx) => (
          <input
            key={idx}
            type="text"
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required={field !== "middle_name"}
          />
        ))}
      </div>

      {/* Passwords */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-6 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
        required
      />

      {/* Role-specific */}
      {role === "Student" && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="college_roll"
            placeholder="College Roll"
            value={formData.college_roll}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="number"
            name="batch_year"
            placeholder="Batch Year"
            value={formData.batch_year}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>
      )}

      {role === "Alumni" && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="number"
            name="batch_year"
            placeholder="Batch Year"
            value={formData.batch_year}
            onChange={handleChange}
            className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>
      )}

      {/* Avatar */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full mb-6"
      />
      {previewImage && (
        <img
          src={previewImage}
          alt="Profile Preview"
          className="h-20 w-20 object-cover rounded-full border mb-4"
        />
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!verified}
        className={`w-full py-3 rounded-lg font-semibold transition-colors 
          ${verified
            ? "bg-amber-400 text-white hover:bg-amber-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Sign Up
      </button>
    </form>
  );
}
