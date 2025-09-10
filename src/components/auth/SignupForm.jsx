import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState(""); // "student" or "alumni"
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

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // API calls
  const handleStudentSubmit = async (dataToSend) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/students/registerStudent",
        {
          method: "POST",
          body: dataToSend,
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Student created:", data);
        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Student signup failed");
      }
    } catch (err) {
      console.error("Student signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleAlumniSubmit = async (dataToSend) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/alumni/registerAlumni",
        {
          method: "POST",
          body: dataToSend,
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Alumni created:", data);
        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Alumni signup failed");
      }
    } catch (err) {
      console.error("Alumni signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Main submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "password") {
          dataToSend.append("password_hash", value); // backend expects this
        } else {
          dataToSend.append(key, value);
        }
      }
    });

    if (role === "student") {
      await handleStudentSubmit(dataToSend);
    } else if (role === "alumni") {
      await handleAlumniSubmit(dataToSend);
    } else {
      alert("Please select Student or Alumni first.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {/* Role selector */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`px-4 py-2 rounded ${
            role === "student" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Student Signup
        </button>
        <button
          type="button"
          onClick={() => setRole("alumni")}
          className={`px-4 py-2 rounded ${
            role === "alumni" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Alumni Signup
        </button>
      </div>

      {role && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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

          {/* Email + Password */}
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

          {/* Student Fields */}
          {role === "student" && (
            <>
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
            </>
          )}

          {/* Alumni Fields */}
          {role === "alumni" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
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
            </>
          )}

          {/* Profile Image */}
          <div>
            <label className="block mb-2 font-medium">Profile Image</label>
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
            Sign Up as {role === "student" ? "Student" : "Alumni"}
          </button>
        </form>
      )}
    </div>
  );
}
