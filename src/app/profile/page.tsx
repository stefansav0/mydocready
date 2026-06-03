"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setName(parsed.name || "");
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        No active session.{" "}
        <a href="/signin" className="text-blue-600">
          Sign in
        </a>
      </div>
    );
  }

  // UPDATE NAME
  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("Profile updated successfully");

      // update localStorage
      const updatedUser = { ...user, name };
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
      setUser(updatedUser);
    } catch (err: any) {
      setMessage(err.message || "Error updating profile");
    }

    setLoading(false);
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "/api/profile/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("Password updated successfully");
      setPassword("");
    } catch (err: any) {
      setMessage(err.message || "Error changing password");
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) return;

    setMessage("Account deletion not implemented yet");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        👤 My Profile
      </h1>

      {message && (
        <div className="mb-4 text-sm text-blue-600">
          {message}
        </div>
      )}

      {/* NAME */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Full Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Email
        </label>

        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded mr-2"
      >
        Save Changes
      </button>

      <hr className="my-6" />

      {/* PASSWORD */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          New Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading || !password}
        className="border border-blue-600 text-blue-600 text-sm px-4 py-2 rounded"
      >
        Change Password
      </button>

      <hr className="my-6" />

      {/* DELETE */}
      <button
        onClick={handleDeleteAccount}
        className="text-red-600 text-sm"
      >
        🗑️ Delete Account
      </button>
    </div>
  );
}