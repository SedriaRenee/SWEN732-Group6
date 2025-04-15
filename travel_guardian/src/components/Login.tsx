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
      const { user } = await res.json();
      localStorage.setItem("username", user.username);
      router.push(`/profile/${user.username}`); 
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-thin text-center text-black">Travel Guardian</h1>
        
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Login</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 mb-2 rounded text-black"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-orange-500 focus:outline-hidden p-2 mb-4 rounded text-black"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Login
        </button>

       
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?
            <a href="/signup" className="ml-1 text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
