"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./ResetPasswordPage.module.css";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to reset password.");
      }

      setMessage(data.message || "Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
      setOtp("");

      setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Reset Password</h1>

        <p className={styles.subtitle}>
          Enter the OTP from your email and choose a new password.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="otp">OTP</label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">New Password</label>

            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/signin" className={styles.link}>
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}