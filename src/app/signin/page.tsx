"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

import styles from "./SignInPage.module.css"; // Import CSS Module

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      router.push("/");
      router.refresh();
      
    } catch (error) {
      // ✅ FIX: More specific, type-safe error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
        
        <form onSubmit={handleSignIn} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>
          
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className={styles.links}>
          <p>
            {/* ✅ FIX: Escaped the apostrophe */}
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
          <Link href="/forgot-password" className={styles.link}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
