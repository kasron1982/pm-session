import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FeedbackRow = {
  id: string;
  created_at: string;
  first_impression: string;
  clarity: number;
  visual_appeal: number;
  navigation: number;
  open_feedback: string;
};

function avg(rows: FeedbackRow[], key: keyof FeedbackRow) {
  if (!rows.length) return 0;
  return (
    rows.reduce((sum, r) => sum + (r[key] as number), 0) / rows.length
  ).toFixed(1);
}

function ScoreBar({ value }: { value: string }) {
  const pct = (parseFloat(value) / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-2 rounded-full bg-black dark:bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-black dark:text-white w-8 text-right">
        {value}
      </span>
    </div>
  );
}

export default async function ResultsPage() {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: FeedbackRow[] = data || [];
  const total = rows.length;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error loading results: {error.message}</p>
      </div>
    );
  }

  const clarityAvg = avg(rows, "clarity");
  const visualAvg = avg(rows, "visual_appeal");
  const navAvg = avg(rows, "navigation");
  const overallAvg = (
    (parseFloat(clarityAvg) + parseFloat(visualAvg) + parseFloat(navAvg)) /
    3
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Executive Summary</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Website design feedback — {total} {total === 1 ? "response" : "responses"} collected
          </p>
        </div>

        {total === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 text-center text-zinc-400">
            No responses yet. Share the feedback link to get started.
          </div>
        ) : (
          <>
            {/* Overall score */}
            <div className="rounded-2xl bg-black dark:bg-white p-8 text-center">
              <p className="text-sm font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Overall Score</p>
              <p className="mt-2 text-6xl font-bold text-white dark:text-black">{overallAvg}<span className="text-2xl">/5</span></p>
            </div>

            {/* Score breakdown */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 space-y-5">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Score Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-black dark:text-white mb-1">Clarity of message</p>
                  <ScoreBar value={clarityAvg} />
                </div>
                <div>
                  <p className="text-sm text-black dark:text-white mb-1">Visual appeal</p>
                  <ScoreBar value={visualAvg} />
                </div>
                <div>
                  <p className="text-sm text-black dark:text-white mb-1">Ease of navigation</p>
                  <ScoreBar value={navAvg} />
                </div>
              </div>
            </div>

            {/* First impressions */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">First Impressions</h2>
              <div className="flex flex-wrap gap-2">
                {rows.map((r) => (
                  <span
                    key={r.id}
                    className="rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-sm text-black dark:text-white"
                  >
                    {r.first_impression}
                  </span>
                ))}
              </div>
            </div>

            {/* Open feedback */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">What They'd Change</h2>
              <ul className="space-y-4">
                {rows.map((r) => (
                  <li key={r.id} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
                    <p className="text-sm text-black dark:text-white">{r.open_feedback}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* All responses table */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">All Responses</h2>
              <div className="space-y-6">
                {rows.map((r, i) => (
                  <div key={r.id} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-zinc-400">Response #{rows.length - i}</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-zinc-400 text-xs mb-0.5">First impression</p>
                        <p className="text-black dark:text-white font-medium">{r.first_impression}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-xs mb-0.5">Clarity</p>
                        <p className="text-black dark:text-white font-medium">{r.clarity} / 5</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-xs mb-0.5">Visual appeal</p>
                        <p className="text-black dark:text-white font-medium">{r.visual_appeal} / 5</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-xs mb-0.5">Navigation</p>
                        <p className="text-black dark:text-white font-medium">{r.navigation} / 5</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-xs mb-0.5">What they'd change</p>
                      <p className="text-black dark:text-white text-sm">{r.open_feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
