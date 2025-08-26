'use client';

import { useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function ProfilePage() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="p-6">
        No active session. <a href="/signin" className="text-blue-600">Sign in</a>
      </div>
    );
  }

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });

    setMessage(error ? '❌ Error updating profile.' : '✅ Profile updated.');
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    setMessage(error ? '❌ Error changing password.' : '✅ Password updated.');
    if (!error) setPassword('');
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm('Are you sure you want to request account deletion?');
    if (!confirmed) return;

    // TODO: Implement server-side deletion logic
    setMessage('🛑 Account deletion request sent (not implemented).');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">👤 My Profile</h1>

      {message && (
        <div className="mb-4 text-sm text-blue-600">{message}</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter your full name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 mr-2"
        disabled={loading}
      >
        Save Changes
      </button>

      <hr className="my-6" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter new password"
        />
      </div>

      <button
        onClick={handleChangePassword}
        className="border border-blue-600 text-blue-600 text-sm px-4 py-2 rounded hover:bg-blue-50 transition disabled:opacity-50"
        disabled={loading || !password}
      >
        Change Password
      </button>

      <hr className="my-6" />

      <div className="mt-4">
        <button
          onClick={handleDeleteAccount}
          className="text-red-600 hover:underline text-sm"
        >
          🗑️ Request Account Deletion
        </button>
      </div>
    </div>
  );
}
