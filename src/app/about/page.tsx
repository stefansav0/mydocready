"use client";

export default function AboutPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6">About Us</h1>

            <p className="mb-4">
                <strong>MyDocReady</strong> is an online tool built to simplify everyday document and photo editing tasks.
                We help users quickly create passport-size photos, compress images to meet file size limits, and insert photos into official documents — all without installing software or using complicated tools.
            </p>

            <p className="mb-4">
                Whether you&apos;re applying for a job, submitting a government form, or preparing ID documents for school or travel,
                MyDocReady is here to make your process faster, easier, and more accessible.
            </p>

            <p className="mb-4">
                Our tools are designed for everyone — students, professionals, and individuals who just need fast, accurate document editing.
                Everything works directly in your browser, with privacy and simplicity in mind.
            </p>

            <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-4">Our Mission</h2>
            <p className="mb-4">
                To empower people around the world with simple, free, and effective online tools for preparing documents and photos for official use.
            </p>

            <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-4">Why MyDocReady?</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>No software installation required — everything works online</li>
                <li>Free to use with no hidden charges</li>
                <li>Simple and fast interface, even for non-technical users</li>
                <li>Privacy-first: we don&apos;t store your photos or documents</li>
            </ul>

            <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-4">Get in Touch</h2>
            <p>
                Got questions or suggestions? Reach out via our{" "}
                <a href="/contact" className="text-indigo-600 underline">
                    contact page
                </a>{" "}
                — we&apos;d love to hear from you!
            </p>
        </main>
    );
}
