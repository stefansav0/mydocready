"use client";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function TestSupabase() {
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        const check = async () => {
            const { error } = await supabase.from("users").select("*").limit(1);
            if (error) {
                setStatus("❌ Error: " + error.message);
            } else {
                setStatus("✅ Supabase connected successfully.");
            }
        };
        check();
    }, []);

    return <div>{status}</div>;
}
