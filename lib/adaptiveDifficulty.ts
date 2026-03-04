// lib/adaptiveDifficulty.ts
// Adaptive difficulty engine for interview sessions.
// Calculates next session difficulty from recent performance history.

import type { IInterviewSession } from '@/models/InterviewSession';

// ── Types ──────────────────────────────────────────────────────────────────

interface SessionSummary {
    difficulty: number;
    performance: 'exceeded' | 'met' | 'below';
}

// ── Score mapping ──────────────────────────────────────────────────────────

const PERFORMANCE_SCORE: Record<string, number> = {
    exceeded: 1,
    met: 0,
    below: -1,
};

/**
 * Map an overall interview score (1-10) to a performance tier.
 *
 * - 8+  → exceeded expectations
 * - 5-7 → met expectations
 * - <5  → below expectations
 */
export function scoreToPerformance(overallScore: number): 'exceeded' | 'met' | 'below' {
    if (overallScore >= 8) return 'exceeded';
    if (overallScore >= 5) return 'met';
    return 'below';
}

// ── Difficulty calculation ─────────────────────────────────────────────────

/**
 * Calculates the recommended difficulty (1-5) for the next interview session.
 *
 * Uses a weighted average of the most recent sessions (up to 5), where
 * the most recent session carries the highest weight. If no history exists,
 * defaults to 2 (medium-easy).
 */
export function calculateNextDifficulty(sessions: IInterviewSession[]): number {
    const completedSessions = sessions
        .filter((s) => s.status === 'completed' && s.report?.overallScore !== undefined)
        .slice(0, 5); // most recent 5

    if (completedSessions.length === 0) return 2; // default: medium-easy

    // Map to summaries
    const summaries: SessionSummary[] = completedSessions.map((s) => ({
        difficulty: typeof s.config.difficulty === 'number' ? s.config.difficulty : 2,
        performance: scoreToPerformance(s.report!.overallScore),
    }));

    // Weighted average — most recent sessions matter more
    // Weights: [oldest ... newest] = [0.1, 0.15, 0.2, 0.25, 0.3]
    const weights = [0.1, 0.15, 0.2, 0.25, 0.3];
    const actualWeights = weights.slice(Math.max(0, 5 - summaries.length));

    // Normalize weights
    const totalWeight = actualWeights.reduce((sum, w) => sum + w, 0);
    const normalizedWeights = actualWeights.map((w) => w / totalWeight);

    const weightedScore = summaries.reduce((sum, s, i) => {
        const score = PERFORMANCE_SCORE[s.performance] ?? 0;
        return sum + score * (normalizedWeights[i] ?? 0);
    }, 0);

    const currentDiff = summaries[summaries.length - 1].difficulty;

    // Decide next difficulty
    if (weightedScore > 0.5) return Math.min(5, currentDiff + 1);  // Doing great → harder
    if (weightedScore < -0.3) return Math.max(1, currentDiff - 1); // Struggling → easier
    return currentDiff;                                              // Stable → same level
}

// ── Map performance to attempt status ──────────────────────────────────────

/**
 * Convert interview performance to an attempt status for the Save-to-Attempts bridge.
 */
export function performanceToAttemptStatus(
    performance: 'exceeded' | 'met' | 'below',
): 'resolved' | 'solved_with_help' | 'gave_up' {
    if (performance === 'exceeded') return 'resolved';
    if (performance === 'met') return 'solved_with_help';
    return 'gave_up';
}

// ── Difficulty label ───────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<number, string> = {
    1: 'Easy',
    2: 'Medium-Easy',
    3: 'Medium',
    4: 'Medium-Hard',
    5: 'Hard',
};

export function difficultyLabel(level: number): string {
    return DIFFICULTY_LABELS[level] ?? `Level ${level}`;
}
