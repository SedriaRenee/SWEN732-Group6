"use client";

import { useState } from "react";

export default function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleForgotUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgotusername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setUsername(data.username);
      setError("");
    } else {
      setUsername("");
      setError(data.error || "Failed to find username.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-extrabold text-center">Travel Guardian</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Username</h2>

        {username && (
          <p className="text-green-600 font-medium text-center mb-2">
            Your username is: <span className="font-bold">{username}</span>
          </p>
        )}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleForgotUsername}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Get Username
          </button>
        </form>

        
        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <p>
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
          <p>
            Need to reset your password?{" "}
            <a href="/forgotpassword" className="text-blue-600 hover:underline">
              Reset here
            </a>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
