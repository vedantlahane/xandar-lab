import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-100 via-white to-zinc-50 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-gradient-to-br from-zinc-900/10 via-zinc-800/5 to-teal-400/25 blur-3xl" />
        <div className="absolute bottom-12 right-0 h-52 w-52 rounded-full bg-gradient-to-br from-teal-300/25 via-zinc-900/10 to-zinc-800/5 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20 sm:py-24">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Xandar-Lab</h1>
          <Link
            href="/lab"
            className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
          >
            Enter Lab →
          </Link>
        </header>

        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur">
            <span className="inline-flex size-2 rounded-full bg-teal-400" aria-hidden />
            Monochrome lab with a hint of signal
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A calm workspace for developers.
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            Build understanding without the noise. Practice, notes, docs, and experiments will live in one place—attempt-first and distraction-free.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Enter the Lab
              <span aria-hidden>↗</span>
            </Link>

            <Link
              href="/marketing"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
            >
              See the story
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Practice · live</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Notes · planned</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Docs · planned</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Experiments · planned</span>
          </div>
        </section>

        <footer className="text-sm text-zinc-500">Built by Vedant Lahane · Xandar-Lab</footer>
      </main>
    </div>
  );
}
