"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage("Password reset link has been sent to your email.");
      setError("");
    } else {
      setError("Failed to send password reset link. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl text-center text-white mb-3">Travel Guardian</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Forgot Password</h2>

        {message && <p className="text-green-500 text-center mb-2">{message}</p>}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>

        {/* Login / Sign Up / Forgot Username Links */}
        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            Forgot your username?{" "}
            <Link href="/forgotusername" className="text-blue-600 hover:underline">
              Retrieve it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
