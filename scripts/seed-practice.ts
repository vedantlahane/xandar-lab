// scripts/seed-practice.ts
// Run with: npx tsx scripts/seed-practice.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// --- Models ---
import User from '../models/User';
import Attempt from '../models/Attempt';
import { Discussion } from '../models/Attempt';
import Explanation from '../models/Explanation';
import InterviewSession from '../models/InterviewSession';
import ActivityLog from '../models/ActivityLog';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// --- Problem data (matches sheet.ts IDs) ---
const PROBLEMS = {
    // Easy problems
    'arr-1':  { title: "Kadane's Algorithm",           diff: 'Easy',   topic: 'Array and 2D Array' },
    'arr-2':  { title: "Pascal's Triangle",            diff: 'Easy',   topic: 'Array and 2D Array' },
    'arr-3':  { title: "Next Permutation",             diff: 'Medium', topic: 'Array and 2D Array' },
    'arr-5':  { title: "Sort an Array of 0s 1s 2s",    diff: 'Easy',   topic: 'Array and 2D Array' },
    'arr-7':  { title: "Stock Buy and Sell",            diff: 'Easy',   topic: 'Array and 2D Array' },
    'arr-10': { title: "Leaders in an Array",           diff: 'Easy',   topic: 'Array and 2D Array' },
    'arr-15': { title: "Longest Consecutive Sequence",  diff: 'Medium', topic: 'Array and 2D Array' },
    'arr-20': { title: "Two Sum",                       diff: 'Easy',   topic: 'Array and 2D Array' },
    'rec-1':  { title: "Pow(x, n)",                     diff: 'Medium', topic: 'Recursion And Backtracking' },
    'rec-5':  { title: "Combination Sum",               diff: 'Medium', topic: 'Recursion And Backtracking' },
    'rec-10': { title: "N-Queens",                      diff: 'Hard',   topic: 'Recursion And Backtracking' },
    'rec-15': { title: "Word Search",                   diff: 'Medium', topic: 'Recursion And Backtracking' },
    'sort-1': { title: "Merge Sort",                    diff: 'Medium', topic: 'Sorting' },
    'll-1':   { title: "Reverse Linked List",           diff: 'Easy',   topic: 'Linked List' },
    'll-5':   { title: "Middle of the Linked List",     diff: 'Easy',   topic: 'Linked List' },
    'st-1':   { title: "Remove All Adjacent Duplicates II", diff: 'Medium', topic: 'Stacks' },
    'st-5':   { title: "Next Greater Element II",       diff: 'Medium', topic: 'Stacks' },
    'bs-1':   { title: "Binary Search",                 diff: 'Easy',   topic: 'Binary Search' },
    'bs-5':   { title: "Search in Rotated Sorted Array",diff: 'Medium', topic: 'Binary Search' },
    'tree-1': { title: "Preorder Traversal",            diff: 'Easy',   topic: 'Trees (Binary + BST)' },
    'tree-5': { title: "Maximum Depth of Binary Tree",  diff: 'Easy',   topic: 'Trees (Binary + BST)' },
    'tree-10':{ title: "Balanced Binary Tree",          diff: 'Easy',   topic: 'Trees (Binary + BST)' },
    'dp-1':   { title: "Max Sum Without Adjacents",     diff: 'Easy',   topic: 'Dynamic Programming' },
    'dp-3':   { title: "Frog Jump",                     diff: 'Easy',   topic: 'Dynamic Programming' },
    'dp-5':   { title: "0/1 Knapsack",                  diff: 'Medium', topic: 'Dynamic Programming' },
    'dp-10':  { title: "Longest Common Subsequence",    diff: 'Medium', topic: 'Dynamic Programming' },
    'dp-15':  { title: "Edit Distance",                 diff: 'Hard',   topic: 'Dynamic Programming' },
    'graph-1':{ title: "BFS of Graph",                  diff: 'Easy',   topic: 'Graphs' },
    'graph-5':{ title: "Topological Sort (Kahn's)",     diff: 'Medium', topic: 'Graphs' },
    'graph-10':{ title: "Number of Islands",            diff: 'Medium', topic: 'Graphs' },
    'graph-15':{ title: "Dijkstra's Algorithm",         diff: 'Medium', topic: 'Graphs' },
} as const;

type ProblemId = keyof typeof PROBLEMS;

function daysAgo(n: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
    return d;
}

function randomDuration(minMin: number, maxMin: number): number {
    return (minMin + Math.floor(Math.random() * (maxMin - minMin))) * 60;
}

function dateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

async function main() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected');

    // --- Find or create demo user ---
    let user = await User.findOne({ username: 'demo' });
    if (!user) {
        user = await User.findOne({});
    }
    if (!user) {
        console.log('No user found, creating demo user...');
        user = await User.create({
            username: 'demo',
            email: 'demo@xandar.dev',
            savedProblems: [],
            completedProblems: [],
        });
    }
    const userId = user._id;
    console.log(`👤 Using user: ${user.username} (${userId})`);

    // --- Clear existing practice data for this user ---
    console.log('🧹 Clearing existing practice data...');
    await Attempt.deleteMany({ userId });
    await Discussion.deleteMany({ userId });
    await Explanation.deleteMany({ userId });
    await InterviewSession.deleteMany({ userId });
    await ActivityLog.deleteMany({ userId });
    console.log('✅ Cleared');

    // --- Seed Attempts ---
    console.log('📝 Seeding attempts...');
    const attemptDocs: any[] = [];

    // 15 "resolved" attempts across 15 different problems
    const resolvedProblems: { id: ProblemId; day: number }[] = [
        { id: 'arr-1',   day: 28 },
        { id: 'arr-2',   day: 26 },
        { id: 'arr-5',   day: 24 },
        { id: 'arr-7',   day: 22 },
        { id: 'arr-20',  day: 20 },
        { id: 'll-1',    day: 18 },
        { id: 'll-5',    day: 16 },
        { id: 'bs-1',    day: 15 },
        { id: 'tree-1',  day: 13 },
        { id: 'tree-5',  day: 11 },
        { id: 'dp-1',    day: 9 },
        { id: 'dp-3',    day: 7 },
        { id: 'arr-3',   day: 5 },
        { id: 'sort-1',  day: 3 },
        { id: 'graph-1', day: 1 },
    ];

    const solveMethodOptions = ['Independently', 'With hints', 'From editorial'];
    const confidenceOptions = ['Definitely', 'Probably', 'Not sure'];
    const keyInsights = [
        'Recognizing the sliding window pattern made this click.',
        'The key was using a hash map for O(1) lookups.',
        'Drawing out the recursion tree helped visualize the solution.',
        'Sorting first simplified the comparison logic significantly.',
        'Using two pointers avoided the need for extra space.',
        'The trick is thinking of it as a graph traversal problem.',
        'Breaking the problem into subproblems made the DP approach clear.',
    ];

    for (const { id, day } of resolvedProblems) {
        const prob = PROBLEMS[id];
        const dur = prob.diff === 'Easy' ? randomDuration(5, 15)
            : prob.diff === 'Medium' ? randomDuration(15, 40)
            : randomDuration(30, 90);
        const ts = daysAgo(day);

        attemptDocs.push({
            userId,
            problemId: id,
            content: `Approach: Used ${prob.diff === 'Easy' ? 'straightforward' : 'optimized'} algorithm for ${prob.title}. Started with brute force and improved.`,
            code: `# Solution for ${prob.title}\ndef solve(input):\n    # Implementation here\n    pass`,
            language: 'Python',
            timeComplexity: prob.diff === 'Easy' ? 'O(n)' : prob.diff === 'Medium' ? 'O(n log n)' : 'O(n²)',
            spaceComplexity: 'O(n)',
            feltDifficulty: prob.diff === 'Easy' ? 2 : prob.diff === 'Medium' ? 3 : 4,
            duration: dur,
            status: 'resolved',
            solveMethod: solveMethodOptions[Math.floor(Math.random() * solveMethodOptions.length)],
            keyInsight: keyInsights[Math.floor(Math.random() * keyInsights.length)],
            confidence: confidenceOptions[Math.floor(Math.random() * confidenceOptions.length)],
            timestamp: ts,
            resolvedAt: new Date(ts.getTime() + dur * 1000),
        });
    }

    // 8 "gave_up" attempts
    const gaveUpProblems: { id: ProblemId; day: number; reason: string }[] = [
        { id: 'dp-5',    day: 20, reason: 'Wrong approach / algorithm' },
        { id: 'dp-10',   day: 17, reason: 'Wrong approach / algorithm' },
        { id: 'dp-15',   day: 14, reason: 'Completely stuck' },
        { id: 'graph-5', day: 12, reason: 'Wrong approach / algorithm' },
        { id: 'graph-10',day: 10, reason: 'Completely stuck' },
        { id: 'graph-15',day: 8,  reason: 'Off-by-one / boundary error' },
        { id: 'rec-10',  day: 6,  reason: 'Off-by-one / boundary error' },
        { id: 'st-5',    day: 2,  reason: 'Right answer, wrong complexity (TLE)' },
    ];

    const failureNotes = [
        'Need to review the DP state transition more carefully.',
        'Was on the right track but couldn\'t formalize the recurrence.',
        'Should practice graph traversal patterns more.',
        'The boundary conditions keep tripping me up.',
        'Spent too long on brute force before thinking about optimization.',
    ];

    for (const { id, day, reason } of gaveUpProblems) {
        const prob = PROBLEMS[id];
        const dur = randomDuration(20, 60);
        const ts = daysAgo(day);

        attemptDocs.push({
            userId,
            problemId: id,
            content: `Tried to solve ${prob.title} but got stuck. The ${prob.topic} pattern is still not intuitive.`,
            language: 'Python',
            feltDifficulty: prob.diff === 'Medium' ? 4 : 5,
            duration: dur,
            status: 'gave_up',
            failureReason: reason,
            failureNote: failureNotes[Math.floor(Math.random() * failureNotes.length)],
            timestamp: ts,
        });
    }

    // 5 "attempting" (in-progress) attempts
    const attemptingProblems: { id: ProblemId; day: number }[] = [
        { id: 'arr-10',  day: 1 },
        { id: 'arr-15',  day: 0 },
        { id: 'rec-5',   day: 0 },
        { id: 'bs-5',    day: 0 },
        { id: 'tree-10', day: 1 },
    ];

    for (const { id, day } of attemptingProblems) {
        const prob = PROBLEMS[id];
        attemptDocs.push({
            userId,
            problemId: id,
            content: `Working on ${prob.title}. Currently thinking about the approach.`,
            language: 'Python',
            feltDifficulty: 3,
            duration: randomDuration(5, 20),
            status: 'attempting',
            timestamp: daysAgo(day),
        });
    }

    // 12 "resolved" second attempts on previously gave_up problems
    const retryProblems: { id: ProblemId; day: number }[] = [
        { id: 'dp-5',    day: 15 },
        { id: 'dp-10',   day: 12 },
        { id: 'dp-15',   day: 9 },
        { id: 'graph-5', day: 7 },
        { id: 'graph-10',day: 5 },
        { id: 'graph-15',day: 4 },
        { id: 'rec-10',  day: 3 },
        { id: 'st-5',    day: 1 },
        // additional retries on problems with multiple attempts
        { id: 'dp-5',    day: 10 },
        { id: 'graph-5', day: 4 },
        { id: 'dp-15',   day: 5 },
        { id: 'graph-10',day: 2 },
    ];

    for (const { id, day } of retryProblems) {
        const prob = PROBLEMS[id];
        const dur = randomDuration(15, 45);
        const ts = daysAgo(day);

        attemptDocs.push({
            userId,
            problemId: id,
            content: `Retry: Came back to ${prob.title} with a fresh perspective. ${Math.random() > 0.5 ? 'Used a different approach this time.' : 'Reviewed the pattern first.'}`,
            code: `# Retry solution for ${prob.title}\ndef solve(input):\n    # Improved implementation\n    pass`,
            language: 'Python',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            feltDifficulty: prob.diff === 'Medium' ? 3 : 4,
            duration: dur,
            status: 'resolved',
            solveMethod: 'With hints',
            keyInsight: 'Understanding the pattern from the first failed attempt helped.',
            confidence: 'Probably',
            timestamp: ts,
            resolvedAt: new Date(ts.getTime() + dur * 1000),
        });
    }

    const createdAttempts = await Attempt.insertMany(attemptDocs);
    console.log(`  ✅ Created ${createdAttempts.length} attempts`);

    // --- Seed Discussions ---
    console.log('💬 Seeding discussions...');
    const discussionTexts = [
        'Need to review heap operations before retrying this one.',
        'The key insight was sorting by start time first.',
        'Off by one on the boundary — need to use <= not <.',
        'This is essentially the same pattern as the previous DP problem.',
        'Should practice this pattern more — maybe try related problems next.',
        'The recursion tree visualization really helped here.',
        'Time complexity could be improved with memoization.',
        'Edge case: empty input needs special handling.',
        'Used a monotonic stack — same pattern as next greater element.',
        'Finally understood why we need to process in reverse order.',
        'The two-pointer approach is much cleaner than the brute-force.',
        'Need to revisit this in a week to make sure it sticks.',
        'Binary search on the answer — didn\'t think of that approach initially.',
        'Connected this to the graph coloring problem we did before.',
        'Practice implementing this without looking at the solution next time.',
    ];

    // Pick 6 attempts for discussions
    const discussionAttempts = createdAttempts.filter(a =>
        ['dp-5', 'graph-5', 'dp-15', 'arr-1', 'graph-10', 'rec-10'].includes(a.problemId)
    ).slice(0, 6);

    const discussions: any[] = [];
    let textIdx = 0;
    for (const attempt of discussionAttempts) {
        const count = 2 + Math.floor(Math.random() * 2); // 2-3 discussions per attempt
        for (let i = 0; i < count && textIdx < discussionTexts.length; i++) {
            discussions.push({
                attemptId: attempt._id,
                userId,
                username: user.username,
                content: discussionTexts[textIdx++],
                timestamp: new Date(new Date(attempt.timestamp).getTime() + (i + 1) * 3600000),
            });
        }
    }

    await Discussion.insertMany(discussions);
    console.log(`  ✅ Created ${discussions.length} discussions`);

    // --- Seed Explanations ---
    console.log('📖 Seeding explanations...');
    const explanations = [
        {
            userId,
            problemId: 'arr-20',
            content: `Two Sum asks us to find two numbers in an array that add up to a target value. The brute force approach checks every pair (O(n²)), but we can do better.\n\nThe optimal approach uses a hash map. As we iterate through the array, for each number we check if (target - current) exists in our map. If it does, we found our pair. If not, we store the current number and its index.\n\nThis gives us O(n) time and O(n) space. The key insight is that for each number, there's only one complement that would sum to the target, and we can check for it in O(1) using a hash map.`,
            feedback: {
                clarity: 8,
                completeness: 7,
                conciseness: 9,
                good: 'You explained the core algorithm clearly and mentioned the key data structure. Good progression from brute force to optimal.',
                missing: 'Consider discussing edge cases like duplicate values and why the single-pass approach works vs two-pass.',
            },
            timestamp: daysAgo(20),
        },
        {
            userId,
            problemId: 'st-1',
            content: `Remove All Adjacent Duplicates II requires removing groups of k adjacent identical characters repeatedly.\n\nWe use a stack where each element tracks the character and its consecutive count. For each new character: if it matches the stack top, increment count; if count reaches k, pop it. Otherwise, push a new entry.\n\nThis processes the string in a single pass — O(n) time. The stack never holds more entries than the string length, so O(n) space. The stack-based approach elegantly handles cascading removals that happen when removing one group creates a new group.`,
            feedback: {
                clarity: 9,
                completeness: 8,
                conciseness: 8,
                good: 'Excellent explanation of the stack-based approach. Clear description of the algorithm steps.',
                missing: 'Could mention why naive repeated scanning would be O(n²) to motivate the stack approach.',
            },
            timestamp: daysAgo(15),
        },
        {
            userId,
            problemId: 'graph-1',
            content: `BFS (Breadth-First Search) of a graph explores nodes level by level starting from a source node. We use a queue to process nodes in FIFO order.\n\nAlgorithm: Start by enqueuing the source node and marking it visited. While the queue isn't empty, dequeue a node, process it, and enqueue all its unvisited neighbors. This guarantees we visit nodes in order of their distance from the source.\n\nTime complexity is O(V + E) where V is vertices and E is edges — we visit each vertex once and check each edge once. Space is O(V) for the visited set and queue. BFS is foundational for shortest path in unweighted graphs, level-order traversal, and many flood-fill type problems.`,
            feedback: {
                clarity: 8,
                completeness: 9,
                conciseness: 7,
                good: 'Thorough explanation covering algorithm, complexity, and applications. Well-structured.',
                missing: 'Consider discussing the difference between BFS on trees vs graphs (need visited set for graphs due to cycles).',
            },
            timestamp: daysAgo(10),
        },
    ];

    await Explanation.insertMany(explanations);
    console.log(`  ✅ Created ${explanations.length} explanations`);

    // --- Seed InterviewSessions ---
    console.log('🎤 Seeding interview sessions...');
    const session1StartedAt = daysAgo(14);
    const session2StartedAt = daysAgo(5);

    const interviewSessions = [
        {
            userId,
            config: { style: 'Meta', difficulty: 'Medium', topic: 'Arrays', source: 'sheet' as const },
            problemId: 'arr-15',
            messages: [
                { sender: 'ai', text: "Let's simulate a Meta-style interview. You'll be working on the Longest Consecutive Sequence problem. Given an unsorted array of integers, find the length of the longest consecutive elements sequence. Your algorithm should run in O(n) time.\n\nHow do you understand this problem?", timestamp: session1StartedAt },
                { sender: 'user', text: "So we need to find the longest streak of consecutive numbers. For example, [100, 4, 200, 1, 3, 2] would give 4 because of [1, 2, 3, 4]. And we need O(n) time so sorting won't work directly.", timestamp: new Date(session1StartedAt.getTime() + 120000) },
                { sender: 'ai', text: "Good understanding. You correctly identified that sorting would be O(n log n). What data structure could help us check for consecutive numbers efficiently?", timestamp: new Date(session1StartedAt.getTime() + 180000) },
                { sender: 'user', text: "A hash set! We can put all numbers in a set, then for each number that's the start of a sequence (no num-1 in set), we count how far the sequence goes.", timestamp: new Date(session1StartedAt.getTime() + 300000) },
                { sender: 'ai', text: "Excellent approach. The key insight about checking for sequence starts (numbers without num-1) is what makes this O(n). Can you walk me through the implementation?", timestamp: new Date(session1StartedAt.getTime() + 360000) },
                { sender: 'user', text: "Sure. First, add all numbers to a HashSet. Then iterate through each number. If num-1 is NOT in the set, this is a sequence start. From there, keep checking num+1, num+2, etc. Track the max length.", timestamp: new Date(session1StartedAt.getTime() + 480000) },
                { sender: 'ai', text: "That's clean. Go ahead and code it up.", timestamp: new Date(session1StartedAt.getTime() + 540000) },
                { sender: 'user', text: "def longestConsecutive(nums):\n    num_set = set(nums)\n    max_len = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            length = 1\n            while num + length in num_set:\n                length += 1\n            max_len = max(max_len, length)\n    return max_len", timestamp: new Date(session1StartedAt.getTime() + 900000) },
                { sender: 'ai', text: "Clean implementation. The time complexity is O(n) because each number is only visited as part of one sequence. What about edge cases?", timestamp: new Date(session1StartedAt.getTime() + 960000) },
                { sender: 'user', text: "Empty array returns 0. Array with duplicates still works because we use a set. Single element returns 1.", timestamp: new Date(session1StartedAt.getTime() + 1080000) },
            ],
            hintsUsed: 0,
            phases: ['Understanding', 'Approach', 'Code', 'Review'],
            duration: 22 * 60,
            status: 'completed' as const,
            report: {
                overallScore: 8,
                metrics: [
                    { name: 'Problem Understanding', score: 9 },
                    { name: 'Approach & Algorithm', score: 8 },
                    { name: 'Code Quality', score: 8 },
                    { name: 'Communication', score: 9 },
                    { name: 'Time Management', score: 7 },
                ],
                strengths: [
                    'Quickly identified the O(n) constraint and avoided sorting',
                    'Clean, readable code implementation',
                    'Good communication of thought process throughout',
                ],
                improvements: [
                    'Could discuss space-time tradeoffs more explicitly',
                    'Consider mentioning alternative approaches before committing',
                ],
                suggestedProblemIds: ['arr-3', 'graph-10', 'dp-10'],
            },
            startedAt: session1StartedAt,
            endedAt: new Date(session1StartedAt.getTime() + 22 * 60 * 1000),
        },
        {
            userId,
            config: { style: 'General', difficulty: 'Easy', topic: 'Trees', source: 'sheet' as const },
            problemId: 'tree-5',
            messages: [
                { sender: 'ai', text: "Welcome to your interview session. Today we'll work on finding the maximum depth of a binary tree. Given the root of a binary tree, return its maximum depth.\n\nThe maximum depth is the number of nodes along the longest path from the root down to the farthest leaf.\n\nHow would you approach this?", timestamp: session2StartedAt },
                { sender: 'user', text: "This is a classic recursion problem. The depth of a tree is 1 + max(depth of left subtree, depth of right subtree). Base case: null node returns 0.", timestamp: new Date(session2StartedAt.getTime() + 60000) },
                { sender: 'ai', text: "That's the recursive approach. Can you also think of an iterative solution?", timestamp: new Date(session2StartedAt.getTime() + 120000) },
                { sender: 'user', text: "For iterative, we can use BFS with a queue. Process level by level, incrementing depth counter for each level. When the queue is empty, we have the max depth.", timestamp: new Date(session2StartedAt.getTime() + 240000) },
                { sender: 'ai', text: "Good, you know both approaches. Go ahead and implement both.", timestamp: new Date(session2StartedAt.getTime() + 300000) },
                { sender: 'user', text: "# Recursive\ndef maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n\n# Iterative BFS\ndef maxDepthBFS(root):\n    if not root:\n        return 0\n    queue = [root]\n    depth = 0\n    while queue:\n        depth += 1\n        next_level = []\n        for node in queue:\n            if node.left: next_level.append(node.left)\n            if node.right: next_level.append(node.right)\n        queue = next_level\n    return depth", timestamp: new Date(session2StartedAt.getTime() + 600000) },
                { sender: 'ai', text: "Both implementations look correct. Let's analyze the complexity.", timestamp: new Date(session2StartedAt.getTime() + 660000) },
                { sender: 'user', text: "Both are O(n) time since we visit every node once. Recursive is O(h) space for the call stack where h is height. BFS is O(w) where w is the maximum width of the tree.", timestamp: new Date(session2StartedAt.getTime() + 780000) },
            ],
            hintsUsed: 0,
            phases: ['Understanding', 'Approach', 'Code', 'Review'],
            duration: 15 * 60,
            status: 'completed' as const,
            report: {
                overallScore: 9,
                metrics: [
                    { name: 'Problem Understanding', score: 9 },
                    { name: 'Approach & Algorithm', score: 9 },
                    { name: 'Code Quality', score: 9 },
                    { name: 'Communication', score: 8 },
                    { name: 'Time Management', score: 9 },
                ],
                strengths: [
                    'Demonstrated both recursive and iterative solutions',
                    'Accurate complexity analysis with nuanced space discussion',
                    'Clean, Pythonic code',
                ],
                improvements: [
                    'Could discuss when to prefer BFS vs DFS in practice',
                    'Consider mentioning DFS iterative approach with explicit stack',
                ],
                suggestedProblemIds: ['tree-1', 'tree-10', 'graph-1'],
            },
            startedAt: session2StartedAt,
            endedAt: new Date(session2StartedAt.getTime() + 15 * 60 * 1000),
        },
    ];

    await InterviewSession.insertMany(interviewSessions);
    console.log(`  ✅ Created ${interviewSessions.length} interview sessions`);

    // --- Seed ActivityLog (30 days) ---
    console.log('📊 Seeding activity logs...');
    const activityLogs: any[] = [];

    // Build a map of what was attempted/completed on each day from the attempts
    const dayMap = new Map<string, { attempted: Set<string>; completed: Set<string>; duration: number; count: number }>();

    for (const a of attemptDocs) {
        const day = dateStr(a.timestamp);
        if (!dayMap.has(day)) {
            dayMap.set(day, { attempted: new Set(), completed: new Set(), duration: 0, count: 0 });
        }
        const entry = dayMap.get(day)!;
        entry.attempted.add(a.problemId);
        entry.duration += a.duration || 0;
        entry.count++;
        if (a.status === 'resolved' || a.status === 'solved_with_help') {
            entry.completed.add(a.problemId);
        }
    }

    // Fill in 30 days of logs, merging with attempt-derived data
    for (let i = 30; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const day = dateStr(d);

        const existing = dayMap.get(day);

        // Add some baseline activity even on days without specific attempts
        let attempted = existing ? Array.from(existing.attempted) : [];
        let completed = existing ? Array.from(existing.completed) : [];
        let duration = existing?.duration || 0;
        let count = existing?.count || 0;

        // Add some random additional activity following the trend
        if (i <= 7) {
            // Recent days: 1-4 problems per day
            const extra = Math.floor(Math.random() * 3);
            for (let e = 0; e < extra; e++) {
                const extraIds = ['arr-10', 'arr-15', 'rec-5', 'bs-5', 'tree-10', 'st-1', 'rec-1'];
                const extraId = extraIds[Math.floor(Math.random() * extraIds.length)];
                if (!attempted.includes(extraId)) {
                    attempted.push(extraId);
                    count++;
                    duration += randomDuration(10, 30);
                }
            }
        } else if (i <= 14) {
            // Middle days: 2-3 per day
            const extra = Math.floor(Math.random() * 2);
            for (let e = 0; e < extra; e++) {
                const extraIds = ['dp-3', 'graph-1', 'll-1', 'tree-1'];
                const extraId = extraIds[Math.floor(Math.random() * extraIds.length)];
                if (!attempted.includes(extraId)) {
                    attempted.push(extraId);
                    count++;
                    duration += randomDuration(10, 25);
                }
            }
        }

        if (attempted.length > 0 || completed.length > 0) {
            activityLogs.push({
                userId,
                date: day,
                problemsAttempted: attempted,
                problemsCompleted: completed,
                totalDuration: duration,
                attemptsCount: count,
            });
        }
    }

    await ActivityLog.insertMany(activityLogs);
    console.log(`  ✅ Created ${activityLogs.length} activity logs`);

    // --- Update user ---
    console.log('👤 Updating user data...');
    const savedProblemIds = ['arr-3', 'arr-10', 'arr-15', 'rec-5', 'bs-5', 'dp-10', 'graph-10', 'graph-15'];
    const completedProblemIds = [
        ...resolvedProblems.map(p => p.id),
        // Also include retries that resolved
        'dp-5', 'dp-10', 'dp-15', 'graph-5', 'graph-10', 'graph-15', 'rec-10', 'st-5',
    ];
    const uniqueCompleted = [...new Set(completedProblemIds)];

    await User.findByIdAndUpdate(userId, {
        $set: {
            savedProblems: savedProblemIds,
            completedProblems: uniqueCompleted,
        },
    });
    console.log(`  ✅ Set ${savedProblemIds.length} saved problems`);
    console.log(`  ✅ Set ${uniqueCompleted.length} completed problems`);

    // --- Summary ---
    console.log('\n🎉 Seed complete! Summary:');
    console.log(`  Attempts:     ${createdAttempts.length}`);
    console.log(`  Discussions:  ${discussions.length}`);
    console.log(`  Explanations: ${explanations.length}`);
    console.log(`  Interviews:   ${interviewSessions.length}`);
    console.log(`  Activity logs: ${activityLogs.length}`);
    console.log(`  User updated: ${user.username}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
}

main().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
