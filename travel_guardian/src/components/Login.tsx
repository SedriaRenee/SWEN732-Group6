"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (res.ok) {
      const { user, token } = await res.json();
      localStorage.setItem("username", user.username);
      localStorage.setItem("token", token);
      localStorage.setItem("userID", user.id);
      router.push(`/profile/${user.username}`);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Travel Guardian</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Login
        </button>

        <div className="mt-4 text-center">
          <a href="/forgotpassword" className="text-blue-600 text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="mt-2 text-center">
          <a href="/forgotusername" className="text-blue-600 text-sm hover:underline">
            Forgot username?
          </a>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
