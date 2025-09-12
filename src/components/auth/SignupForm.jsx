import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithRefresh } from "../../utils/fetchWithRefresh";

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState(""); // "Student" or "Alumni"
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
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

      {/* Render the entire form only if a role is selected */}
      {role && (
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
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required={field !== "middle_name"}
              />
            ))}
          </div>

          {/* Email & Password */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-6 p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            required
          />

          {/* Conditional fields based on role */}
          {role === "Student" && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="college_roll"
                placeholder="College Roll"
                value={formData.college_roll}
                onChange={handleChange}
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
              <input
                type="number"
                name="batch_year"
                placeholder="Batch Year"
                value={formData.batch_year}
                onChange={handleChange}
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
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
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
              <input
                type="number"
                name="batch_year"
                placeholder="Batch Year"
                value={formData.batch_year}
                onChange={handleChange}
                className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
              />
            </div>
          )}

          {/* Avatar upload */}
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

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-colors"
          >
            Sign Up
          </button>
        </>
      )}
    </form>
  );
}
