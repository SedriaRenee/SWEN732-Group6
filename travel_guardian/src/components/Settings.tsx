"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { username } = useParams();

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "deactivate">("profile");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: any = {};

    if (activeTab === "profile") {
      if (formData.username) payload.newUsername = formData.username;
      if (formData.email) payload.email = formData.email;
    }

    if (activeTab === "password") {
      if (!formData.currentPassword || !formData.newPassword) {
        setFeedbackMessage("Both current and new password are required.");
        setFeedbackType("error");
        return;
      }
      if (formData.newPassword.length < 8) {
        setFeedbackMessage("New password must be at least 8 characters long.");
        setFeedbackType("error");
        return;
      }
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    try {
      const res = await fetch(`/api/profile/${username}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedbackMessage("Settings updated successfully!");
        setFeedbackType("success");

        // Redirect after short delay
        setTimeout(() => {
          if (payload.newUsername && payload.newUsername !== username) {
            router.replace(`/profile/${payload.newUsername}`);
          } else {
            router.push(`/profile/${username}`);
          }
        }, 1000);
      } else {
        const err = await res.json();
        setFeedbackMessage(err.message || "Failed to update settings.");
        setFeedbackType("error");
      }
    } catch (err) {
      console.error("Update error:", err);
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
    }
  };

  const confirmDelete = async () => {
    if (confirmInput !== username) {
      setFeedbackMessage("Typed username does not match. Please try again.");
      setFeedbackType("error");
      return;
    }

    try {
      const res = await fetch(`/api/profile/${username}/settings`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedbackMessage("Account deleted successfully.");
        setFeedbackType("success");
        router.push("/login");
      } else {
        const err = await res.json();
        setFeedbackMessage(err.message || "Failed to delete account.");
        setFeedbackType("error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
    }
  };

  const handleCancel = () => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-3xl font-semibold mb-6">Account Settings</h2>

      {/* Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            feedbackType === "success"
              ? "bg-green-50 border-l-4 border-green-400 text-green-700"
              : feedbackType === "error"
              ? "bg-red-50 border-l-4 border-red-400 text-red-700"
              : "bg-blue-50 border-l-4 border-blue-400 text-blue-700"
          }`}
        >
          {feedbackMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        {["profile", "password", "deactivate"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? tab === "deactivate"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="New Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="New Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
      )}

      {/* Password Form */}
      {activeTab === "password" && (
        <div className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
      )}

      {/* Deactivation */}
      {activeTab === "deactivate" && (
        <div className="space-y-4 mt-4">
          {!showDeleteConfirm ? (
            <>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg space-y-4">
              <p className="text-sm text-red-600 font-semibold">
                Type your username to confirm account deletion.
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Enter your username"
                className="w-full border px-4 py-2 rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmInput("");
                  }}
                  className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      {(activeTab === "profile" || activeTab === "password") && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
