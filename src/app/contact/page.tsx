"use client";

import { useRef, useState } from "react";
import emailjs from "emailjs-com";

export default function ContactPage() {
    const form = useRef<HTMLFormElement | null>(null);
    const [status, setStatus] = useState("");

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.current) return;

        setStatus("Sending...");

        emailjs
            .sendForm(
                "service_k56j3jf",         // Your EmailJS Service ID
                "template_3roa5gu",        // Your Template ID
                form.current,
                "k6DDU13l0OXD-Xs35"        // Your Public Key (User ID)
            )
            .then(() => {
                setStatus("✅ Message sent successfully!");
                form.current?.reset();
            })
            .catch((error) => {
                console.error(error);
                setStatus("❌ Failed to send message.");
            });
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-16 text-gray-800">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6">Contact Us</h1>
            <p className="mb-6">
                Have questions, feedback, or technical issues? We’re happy to help.
            </p>

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                    <label className="block font-medium mb-1">Your Name</label>
                    <input
                        name="name" // ✅ matches {{name}} in EmailJS template
                        type="text"
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Email Address</label>
                    <input
                        name="email" // ✅ matches {{email}} for reply-to
                        type="email"
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Message</label>
                    <textarea
                        name="message" // ✅ matches {{message}} in EmailJS
                        className="w-full border px-4 py-2 rounded min-h-[120px]"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                    Send Message
                </button>
                {status && <p className="text-sm mt-2">{status}</p>}
            </form>
        </main>
    );
}
