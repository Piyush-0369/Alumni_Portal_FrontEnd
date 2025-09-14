import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";

export default function SignupForm() {
  const router = useRouter();

  const [role, setRole] = useState(""); 
  const [step, setStep] = useState("email"); // "email" → "otp" → "form"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

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
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Handle normal input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle avatar upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Step 1: Send OTP
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
      // TODO: Replace with backend API call
      console.log("Sending OTP to:", email);
      setOtpSent(true);
      setStep("otp");
      alert("OTP sent to " + email);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      // TODO: Replace with backend API call
      console.log("Verifying OTP:", otp);

      if (otp === "123456") { // demo only
        setVerified(true);
        setStep("form");
        alert("✅ Email verified successfully!");
      } else {
        alert("❌ OTP does not match.");
      }
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleResendOtp = () => {
    if (!email) {
      alert("Enter email before resending OTP");
      return;
    }
    console.log("Resending OTP to:", email);
    alert("OTP resent to " + email);
  };

  // ✅ Step 3: Submit final form
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        router.push("/profile");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Role selector (always visible) */}
      {/* Role selector (always visible) */}
<div className="flex justify-center gap-4 mb-6">
  {["Student", "Alumni"].map((r) => (
    <button
      key={r}
      type="button"
      onClick={() => !verified && setRole(r)} // ⬅ only allow change if not verified
      disabled={verified} // ⬅ lock after verification
      className={`px-4 py-2 rounded-lg font-medium transition 
        ${role === r
          ? "bg-amber-400 text-white shadow-md"
          : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
        }
        ${verified ? "opacity-50 cursor-not-allowed" : ""}  // ⬅ style when locked
      `}
    >
      {r}
    </button>
  ))}
</div>


      {/* STEP 1: Enter email */}
      {step === "email" && role && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full py-3 rounded-lg bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-colors"
          >
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2: Verify OTP */}
      {step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleResendOtp}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </div>
        </>
      )}

      {/* STEP 3: Show full signup form only after verification */}
      {step === "form" && verified && (
        <>
          {/* Name fields */}
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

          {/* Email is fixed (already verified) */}
          <input
            type="email"
            value={email}
            disabled
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />

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

          {/* Conditional fields */}
          {role === "Student" && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input type="text" name="college_roll" placeholder="College Roll"
                value={formData.college_roll} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
              <input type="text" name="course" placeholder="Course"
                value={formData.course} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
              <input type="number" name="batch_year" placeholder="Batch Year"
                value={formData.batch_year} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
            </div>
          )}

          {role === "Alumni" && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input type="text" name="degree" placeholder="Degree"
                value={formData.degree} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
              <input type="text" name="department" placeholder="Department"
                value={formData.department} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
              <input type="number" name="batch_year" placeholder="Batch Year"
                value={formData.batch_year} onChange={handleChange} className="p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400" required />
            </div>
          )}

          {/* Avatar upload */}
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mb-6" />
          {previewImage && (
            <img src={previewImage} alt="Profile Preview"
              className="h-20 w-20 object-cover rounded-full border mb-4" />
          )}

          <button type="submit" className="w-full py-3 rounded-lg bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-colors">
            Sign Up
          </button>
        </>
      )}
    </form>
  );
}