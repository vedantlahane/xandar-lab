// app/page.tsx

"use client";

import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import {
  ArrowRight,
  FlaskConical,
  FileText,
  BookOpen,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/10 selection:text-primary dark:selection:bg-primary/90 dark:selection:text-primary-foreground">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-teal-400 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-screen w-screen bg-linear-to-b from-white via-transparent to-transparent" />
      </div>
      {/* Subtle noise texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.012] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient orbs with enhanced animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-linear-to-br from-teal-400/25 to-emerald-500/25 dark:from-teal-400/15 dark:to-emerald-500/15 blur-[80px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.5, 0.4],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-linear-to-tr from-violet-400/20 to-purple-500/20 dark:from-violet-400/10 dark:to-purple-500/10 blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-linear-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-400/5 dark:to-blue-500/5 blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-12"
        >
          {/* Header */}
          <motion.header
            variants={item}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
                <FlaskConical className="h-4 w-4" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                Xandar-Lab
              </h1>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-zinc-600 hover:text-zinc-900"
            >
              <Link href="/lab">
                Enter Lab <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.header>

          {/* Hero Section */}
          <section className="space-y-8">
            <motion.h2
              variants={item}
              className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl"
            >
              Your personal <br />
              <span className="text-zinc-400">learning lab.</span>
            </motion.h2>

            <motion.p
              variants={item}
              className="max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl"
            >
              A unified workspace for practice, notes, and experiments. Every
              attempt preserved. Every insight captured.
            </motion.p>

            {/* Status Pills
            <motion.div variants={item} className="pt-8">
              <div className="flex flex-wrap gap-3">
                <StatusPill icon={FlaskConical} label="Practice" status="live" />
                <StatusPill icon={StickyNote} label="Notes" status="planned" />
                <StatusPill icon={BookOpen} label="Docs" status="planned" />
                <StatusPill icon={Sparkles} label="Experiments" status="planned" />
              </div>
            </motion.div> */}
          </section>

          {/* Footer */}
          <motion.footer
            variants={item}
            className="mt-auto pt-12 text-sm text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-zinc-200" />
              Built by Vedant Lahane · Xandar-Lab
            </div>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
}

// function StatusPill({ icon: Icon, label, status }: { icon: any; label: string; status: "live" | "planned" }) {
//   return (
//     <div className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
//       <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-teal-500" />
//       <span>{label}</span>
//       <span
//         className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
//           status === "live"
//             ? "bg-teal-50 text-teal-600"
//             : "bg-zinc-100 text-zinc-400"
//         }`}
//       >
//         {status}
//       </span>
//     </div>
//   );
// }
