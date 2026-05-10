export default function Home() {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-white">Hello World</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">{date}</p>
    </div>
  );
}
