import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setSuccessMessage("Signup successful! Redirecting...");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login"; 
      }, 2000); 
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-thin text-center text-black">Travel Guardian</h1>
        
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Sign Up</h2>      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 border border-gray-300 rounded text-black"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">
        Already have an account?
        <a href="/login" className="ml-1 text-blue-600 hover:underline">
          Log in
        </a>
      </p>

      {success && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-lg font-semibold text-green-600">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}