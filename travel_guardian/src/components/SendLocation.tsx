"use client";
import React, { useState } from "react";

export default function SendLocation() {
  const [method, setMethod] = useState<"sms" | "email">("sms");
  const [to, setTo] = useState("");           // phone number or email address
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendLocation = async () => {
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
  
      const { latitude, longitude } = position.coords;
      const link = `https://maps.google.com/?q=${latitude},${longitude}`;
  
      const res = await fetch("/api/send-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, to, link }),
      });
  
      setSent(res.ok);
    } catch (error) {
      alert("Unable to get your location. Please enable location access.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold">Location Sharing</h1>
        <p>Share your real-​time location via SMS or Email. Simply enter a number or address below.</p>

        <div className="flex justify-center space-x-6">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="method"
              value="sms"
              checked={method === "sms"}
              onChange={() => setMethod("sms")}
            />
            <span>SMS</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="method"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
            />
            <span>Email</span>
          </label>
        </div>

        <input
          type={method === "sms" ? "tel" : "email"}
          placeholder={method === "sms" ? "+1234567890" : "you@example.com"}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
        />

        <button
          onClick={sendLocation}
          disabled={loading || !to}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending…" : "Share My Location"}
        </button>

        {sent && <p className="text-green-600">Your location link was sent!</p>}
      </div>
    </div>
  );
}
