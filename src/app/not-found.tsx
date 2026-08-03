import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Error 404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        The page you requested does not exist or may have moved.
      </p>
      <Link href="/" className="mt-8 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
        Return to MyDocReady
      </Link>
    </section>
  );
}
