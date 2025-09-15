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

  // ✅ Handle input change
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
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setStep("otp");
        alert("✅ OTP sent to " + email);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while sending OTP");
    }
  };

  // ✅ Step 2: Verify OTP
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
      if (res.ok && data.success) {
        setVerified(true);
        setStep("form");
        alert("✅ Email verified successfully!");
      } else {
        alert(data.message || "❌ OTP does not match.");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      alert("Enter email before resending OTP");
      return;
    }
    await handleSendOtp(); // just reuse send API
  };

  // ✅ Step 3: Submit final form (unchanged)
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

  // JSX (unchanged except OTP parts already integrated above)
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
            onClick={() => !verified && setRole(r)}
            disabled={verified}
            className={`px-4 py-2 rounded-lg font-medium transition 
              ${role === r
                ? "bg-amber-400 text-white shadow-md"
                : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
              }
              ${verified ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Step 1: Email */}
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

      {/* Step 2: OTP */}
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

      {/* Step 3: Form → stays the same */}
      {step === "form" && verified && (
        <>
          {/* Your existing form fields remain unchanged */}
          {/* ... */}
        </>
      )}
    </form>
  );
}