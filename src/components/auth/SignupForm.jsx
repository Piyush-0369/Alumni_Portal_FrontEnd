import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    password: "",
    college: "",
    college_roll: "",
    batch_year: "",
    course: "",
    branch: "",
    profileImage: null, // added for profile image
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file)); // preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend.append(key, value);
      });

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: dataToSend, // now multipart/form-data
      });

      if (res.ok) {
        const data = await res.json();
        console.log("User created:", data);
        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Signup failed");
      }
    } catch (err) {
      console.error("Error signing up:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-500 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Role */}
        <div>
          <label className="block mb-2 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        {/* Name Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Middle Name</label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Email + Passwords Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                confirmPassword && confirmPassword !== formData.password
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            {confirmPassword && confirmPassword !== formData.password && (
              <p className="text-red-600 text-sm">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* College + Roll */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">College/University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">College Roll</label>
            <input
              type="text"
              name="college_roll"
              value={formData.college_roll}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Batch Year + Course + Branch */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Batch Year</label>
            <input
              type="number"
              name="batch_year"
              value={formData.batch_year}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Profile Image (optional) */}
        <div>
          <label className="block mb-2 font-medium">Profile Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="mt-2 h-20 w-20 object-cover rounded-full border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
