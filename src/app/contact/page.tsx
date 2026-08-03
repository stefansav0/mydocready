"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
    const form = useRef<HTMLFormElement | null>(null);
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.current) return;

        setIsSubmitting(true);
        setStatus("");

        try {
            const formData = new FormData(form.current);
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    message: formData.get("message"),
                }),
            });

            if (!response.ok) throw new Error("Contact request failed");

            setStatus("success");
            form.current.reset();
        } catch (error) {
            console.error("Contact form submission failed:", error);
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
            <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                
                {/* Simple Back Button */}
                <Link 
                    href="/" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                {/* Clean Header */}
                <header className="mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600">
                        Have questions, feedback, or technical issues? We’re happy to help. Fill out the form below and our team will get back to you shortly.
                    </p>
                </header>

                {/* Minimalist Form */}
                <form ref={form} onSubmit={sendEmail} className="space-y-6 max-w-xl">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                            Your Name
                        </label>
                        <input
                            id="name"
                            name="name" // matches {{name}} in EmailJS template
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                            autoComplete="name"
                            maxLength={80}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email" // matches {{email}} for reply-to
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                            autoComplete="email"
                            maxLength={254}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message" // matches {{message}} in EmailJS
                            placeholder="How can we help you today?"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl min-h-[150px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                            maxLength={5000}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? "Sending Message..." : "Send Message"}
                        </button>
                    </div>

                    {/* Status Messages */}
                    {status === "success" && (
                        <div role="status" aria-live="polite" className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium mt-4">
                            ✅ Your message has been sent successfully! We will be in touch soon.
                        </div>
                    )}
                    {status === "error" && (
                        <div role="alert" className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm font-medium mt-4">
                            ❌ Failed to send message. Please check your internet connection and try again.
                        </div>
                    )}
                </form>
                
            </div>
        </div>
    );
}
