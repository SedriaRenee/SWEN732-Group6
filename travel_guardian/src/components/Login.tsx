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

      // Debugging: Check the response data
      console.log("Login Successful:");
      console.log("User:", user);
      console.log("Token:", token);

      if (typeof window !== "undefined") {
        // Debugging: Check if localStorage is being set correctly
        console.log("Setting localStorage...");
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", token);
      }

      // Debugging: Check if router.push is called
      console.log(`Redirecting to profile: /profile/${user.username}`);
      router.push(`/profile/${user.username}`);
    } else {
      // Debugging: Check the error response
      const errorData = await res.json();
      console.log("Login failed:", errorData);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl text-center text-white mb-3">Travel Guardian</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full max-w-md gap-y-4"
      >
        <h2 className="text-xl font-bold text-center text-blue-600">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded text-black w-full border-2 focus:border-orange-500 focus:outline-hidden rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded text-black w-full border-2 focus:border-orange-500 focus:outline-hidden rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <div className="text-center">
          <a
            href="/forgotusername"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot username?
          </a>
          <a
            href="/forgotpassword"
            className="ml-3 text-blue-600 text-sm hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
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
