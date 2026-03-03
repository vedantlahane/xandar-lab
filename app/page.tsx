"use client";

import Link from "next/link";
import { motion, easeOut, useReducedMotion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Animation variants (static — never re-created) ───── */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
} as const;

const orbPresets = [
  {
    className:
      "absolute -top-40 -right-40 h-125 w-125 rounded-full bg-linear-to-br from-teal-400/25 to-emerald-500/25 dark:from-teal-400/15 dark:to-emerald-500/15 blur-[80px]",
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.4, 0.5, 0.4],
      x: [0, 20, 0],
      y: [0, -20, 0],
    },
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    className:
      "absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-linear-to-tr from-violet-400/20 to-purple-500/20 dark:from-violet-400/10 dark:to-purple-500/10 blur-[80px]",
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.4, 0.3],
      x: [0, -15, 0],
      y: [0, 15, 0],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 2,
    },
  },
  {
    className:
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-150 rounded-full bg-linear-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-400/5 dark:to-blue-500/5 blur-[100px]",
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.2, 0.3, 0.2],
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 1,
    },
  },
];

/* ── Noise texture (generated once, kept static) ───────── */

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

/* ── Component ─────────────────────────────────────────── */

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/10 selection:text-primary dark:selection:bg-primary/90 dark:selection:text-primary-foreground">
      {/* ── Background layers ──────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]" />
        {/* Radial highlight */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-teal-400 opacity-20 blur-[100px]" />
        {/* Top fade */}
        <div className="absolute right-0 top-0 -z-10 h-screen w-screen bg-linear-to-b from-white via-transparent to-transparent dark:from-black" />
      </div>

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.012] dark:opacity-[0.025]"
        aria-hidden="true"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Animated gradient orbs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {orbPresets.map((orb, i) => (
          <motion.div
            key={i}
            className={orb.className}
            style={{ willChange: "transform, opacity" }}
            animate={prefersReducedMotion ? {} : orb.animate}
            transition={orb.transition}
          />
        ))}
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-12"
        >
          {/* Header / Nav */}
          <motion.header
            variants={item}
            className="flex items-center justify-between"
          >
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-offset-4"
              aria-label="Xandar-Lab home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
                <FlaskConical className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Xandar-Lab
              </span>
            </Link>

            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link href="/lab">
                Enter Lab
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.header>

          {/* Hero */}
          <section className="space-y-8" aria-labelledby="hero-heading">
            <motion.h2
              id="hero-heading"
              variants={item}
              className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              Your personal <br />
              <span className="text-muted-foreground">learning lab.</span>
            </motion.h2>

            <motion.p
              variants={item}
              className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              A unified workspace for practice, notes, and experiments. Every
              attempt preserved. Every insight captured.
            </motion.p>
          </section>

          {/* Footer */}
          <motion.footer
            variants={item}
            className="mt-auto pt-12 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-border" />
              <span>Built by Vedant Lahane · Xandar-Lab</span>
            </div>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
}