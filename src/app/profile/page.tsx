"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserSession = {
  email: string;
  name?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser) as UserSession;
      if (parsed.email) {
        setUser(parsed);
        setName(parsed.name || "");
      }
    } catch {
      localStorage.removeItem("user_session");
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update your profile.");

      const updatedUser = { ...user!, name };
      localStorage.setItem("user_session", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not change your password.");

      setPassword("");
      setMessage("Password updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not change your password.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-xl p-6 text-slate-900 dark:text-slate-100">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Your session could not be loaded. Please <Link href="/signin" className="font-semibold text-blue-600 underline">sign in</Link> again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6 text-slate-900 dark:text-slate-100">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

      {message && (
        <p className="mb-4 text-sm text-blue-600" role="status" aria-live="polite">
          {message}
        </p>
      )}

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label htmlFor="profile-name" className="mb-1 block text-sm font-medium">Full name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded border px-3 py-2"
            autoComplete="name"
            maxLength={80}
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="mb-1 block text-sm font-medium">Email</label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            readOnly
            className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-500"
            autoComplete="email"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save changes
        </button>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="password-heading">
        <h2 id="password-heading" className="text-lg font-bold">Change password</h2>
        <div className="mt-4">
          <label htmlFor="profile-password" className="mb-1 block text-sm font-medium">New password</label>
          <input
            id="profile-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border px-3 py-2"
            autoComplete="new-password"
            minLength={8}
          />
        </div>
        <button
          type="button"
          onClick={handleChangePassword}
          disabled={loading || password.length < 8}
          className="mt-4 rounded border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Change password
        </button>
      </section>

      <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        Need help with account data? <Link className="font-semibold text-blue-600 underline" href="/contact">Contact support</Link>.
      </p>
    </div>
  );
}
