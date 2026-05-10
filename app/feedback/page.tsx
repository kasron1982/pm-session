"use client";

import { useState } from "react";

const SCALE = [1, 2, 3, 4, 5];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    first_impression: "",
    clarity: 0,
    visual_appeal: 0,
    navigation: 0,
    open_feedback: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">Thank you! 🎉</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">Your feedback has been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-black dark:text-white">Website Feedback</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Help us improve — takes less than 2 minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          {/* Q1 */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              1. What's the first word that comes to mind when you see this website?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clean, Confusing, Modern…"
              value={form.first_impression}
              onChange={(e) => setForm({ ...form, first_impression: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Q2 */}
          <ScaleQuestion
            label="2. How clearly does the website communicate what it's about?"
            value={form.clarity}
            onChange={(v) => setForm({ ...form, clarity: v })}
          />

          {/* Q3 */}
          <ScaleQuestion
            label="3. How would you rate the overall visual design?"
            value={form.visual_appeal}
            onChange={(v) => setForm({ ...form, visual_appeal: v })}
          />

          {/* Q4 */}
          <ScaleQuestion
            label="4. How easy was it to find what you were looking for?"
            value={form.navigation}
            onChange={(v) => setForm({ ...form, navigation: v })}
          />

          {/* Q5 */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              5. What's one thing you'd change about the design?
            </label>
            <textarea
              required
              rows={3}
              placeholder="Your honest opinion…"
              value={form.open_feedback}
              onChange={(e) => setForm({ ...form, open_feedback: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || form.clarity === 0 || form.visual_appeal === 0 || form.navigation === 0}
            className="w-full rounded-full bg-black dark:bg-white py-3 text-sm font-semibold text-white dark:text-black transition hover:opacity-80 disabled:opacity-40"
          >
            {loading ? "Submitting…" : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ScaleQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black dark:text-white mb-3">{label}</label>
      <div className="flex gap-3">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
              value === n
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-black dark:hover:border-white"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-zinc-400">
        <span>Not at all</span>
        <span>Very much</span>
      </div>
    </div>
  );
}
