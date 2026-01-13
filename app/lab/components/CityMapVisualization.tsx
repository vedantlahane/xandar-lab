"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";

// ===== AERIAL STREET MAP =====
// Pure rectangular grid - only horizontal and vertical streets
// Hollow spaces between streets are 4-sided buildings

interface Node {
    id: string;
    x: number;
    y: number;
}

interface Edge {
    from: string;
    to: string;
}

// ===== PURE RECTANGULAR GRID =====
// All nodes aligned to rows and columns
// Every street is strictly horizontal or vertical

const NODES: Node[] = [
    // === DESTINATION (left of grid) ===
    { id: "DEST", x: 5, y: 50 },

    // === ROW 0 (y = 10) ===
    { id: "R0C0", x: 12, y: 10 },
    { id: "R0C01", x: 18, y: 10 },
    { id: "R0C1", x: 24, y: 10 },
    { id: "R0C11", x: 30, y: 10 },
    { id: "R0C2", x: 38, y: 10 },
    { id: "R0C21", x: 44, y: 10 },
    { id: "R0C3", x: 52, y: 10 },
    { id: "R0C31", x: 58, y: 10 },
    { id: "R0C4", x: 66, y: 10 },
    { id: "R0C41", x: 72, y: 10 },
    { id: "R0C5", x: 80, y: 10 },
    { id: "R0C51", x: 86, y: 10 },
    { id: "R0C6", x: 94, y: 10 },
    { id: "R0C61", x: 100, y: 10 },

    // === ROW 01 (y = 18) ===
    { id: "R01C0", x: 12, y: 18 },
    { id: "R01C01", x: 18, y: 18 },
    { id: "R01C1", x: 24, y: 18 },
    { id: "R01C11", x: 30, y: 18 },
    { id: "R01C2", x: 38, y: 18 },
    { id: "R01C21", x: 44, y: 18 },
    { id: "R01C3", x: 52, y: 18 },
    { id: "R01C31", x: 58, y: 18 },
    { id: "R01C4", x: 66, y: 18 },
    { id: "R01C41", x: 72, y: 18 },
    { id: "R01C5", x: 80, y: 18 },
    { id: "R01C51", x: 86, y: 18 },
    { id: "R01C6", x: 94, y: 18 },
    { id: "R01C61", x: 100, y: 18 },

    // === ROW 1 (y = 26) ===
    { id: "R1C0", x: 12, y: 26 },
    { id: "R1C01", x: 18, y: 26 },
    { id: "R1C1", x: 24, y: 26 },
    { id: "R1C11", x: 30, y: 26 },
    { id: "R1C2", x: 38, y: 26 },
    { id: "R1C21", x: 44, y: 26 },
    { id: "R1C3", x: 52, y: 26 },
    { id: "R1C31", x: 58, y: 26 },
    { id: "R1C4", x: 66, y: 26 },
    { id: "R1C41", x: 72, y: 26 },
    { id: "R1C5", x: 80, y: 26 },
    { id: "R1C51", x: 86, y: 26 },
    { id: "R1C6", x: 94, y: 26 },
    { id: "R1C61", x: 100, y: 26 },


    // === Row 11 (y = 34) ===
    { id: "R11C0", x: 12, y: 34 },
    { id: "R11C01", x: 18, y: 34 },
    { id: "R11C1", x: 24, y: 34 },
    { id: "R11C11", x: 30, y: 34 },
    { id: "R11C2", x: 38, y: 34 },
    { id: "R11C21", x: 44, y: 34 },
    { id: "R11C3", x: 52, y: 34 },
    { id: "R11C31", x: 58, y: 34 },
    { id: "R11C4", x: 66, y: 34 },
    { id: "R11C41", x: 72, y: 34 },
    { id: "R11C5", x: 80, y: 34 },
    { id: "R11C51", x: 86, y: 34 },
    { id: "R11C6", x: 94, y: 34 },
    { id: "R11C61", x: 100, y: 34 },

    // === ROW 2 (y = 42) ===
    { id: "R2C0", x: 12, y: 42 },
    { id: "R2C01", x: 18, y: 42 },
    { id: "R2C1", x: 24, y: 42 },
    { id: "R2C11", x: 30, y: 42 },
    { id: "R2C2", x: 38, y: 42 },
    { id: "R2C21", x: 44, y: 42 },
    { id: "R2C3", x: 52, y: 42 },
    { id: "R2C31", x: 58, y: 42 },
    { id: "R2C4", x: 66, y: 42 },
    { id: "R2C41", x: 72, y: 42 },
    { id: "R2C5", x: 80, y: 42 },
    { id: "R2C51", x: 86, y: 42 },
    { id: "R2C6", x: 94, y: 42 },
    { id: "R2C61", x: 100, y: 42 },

    //=== ROW 21 (y = 50)===
    { id:"R21C0", x: 12, y: 50 },
    { id:"R21C01", x: 18, y: 50 },
    { id:"R21C1", x: 24, y: 50 },
    { id:"R21C11", x: 30, y: 50 },
    { id:"R21C2", x: 38, y: 50 },
    { id:"R21C21", x: 44, y: 50 },
    { id:"R21C3", x: 52, y: 50 }, 
    { id:"R21C31", x: 58, y: 50 },
    { id:"R21C4", x: 66, y: 50 },
    { id:"R21C41", x: 72, y: 50 },
    { id:"R21C5", x: 80, y: 50 },
    { id:"R21C51", x: 86, y: 50 },
    { id:"R21C6", x: 94, y: 50 },
    { id:"R21C61", x: 100, y: 50 },


    // === ROW 3 (y = 58) ===
    { id: "R3C0", x: 12, y: 58 },
    { id: "R3C01", x: 18, y: 58 },
    { id: "R3C1", x: 24, y: 58 },
    { id: "R3C11", x: 30, y: 58 },
    { id: "R3C2", x: 38, y: 58 },
    { id: "R3C21", x: 44, y: 58 },
    { id: "R3C3", x: 52, y: 58 },
    { id: "R3C31", x: 58, y: 58 },
    { id: "R3C4", x: 66, y: 58 },
    { id: "R3C41", x: 72, y: 58 },
    { id: "R3C5", x: 80, y: 58 },
    { id: "R3C51", x: 86, y: 58 },
    { id: "R3C6", x: 94, y: 58 },
    { id: "R3C61", x: 100, y: 58 },

    // === ROW 31 (y=64) ===
    { id: "R31C0", x: 12, y: 64 },
    { id: "R31C01", x: 18, y: 64 },
    { id: "R31C1", x: 24, y: 64 },
    { id: "R31C11", x: 30, y: 64 },
    { id: "R31C2", x: 38, y: 64 },
    { id: "R31C21", x: 44, y: 64 },
    { id: "R31C3", x: 52, y: 64 },
    { id: "R31C31", x: 58, y: 64 },
    { id: "R31C4", x: 66, y: 64 },
    { id: "R31C41", x: 72, y: 64 },
    { id: "R31C5", x: 80, y: 64 },
    { id: "R31C51", x: 86, y: 64 },
    { id: "R31C6", x: 94, y: 64 },
    { id: "R31C61", x: 100, y: 64 },

    // === ROW 4 (y = 74) ===
    { id: "R4C0", x: 12, y: 74 },
    { id: "R4C01", x: 18, y: 74 },
    { id: "R4C1", x: 24, y: 74 },
    { id: "R4C11", x: 30, y: 74 },
    { id: "R4C2", x: 38, y: 74 },
    { id: "R4C21", x: 44, y: 74 },
    { id: "R4C3", x: 52, y: 74 },
    { id: "R4C31", x: 58, y: 74 },
    { id: "R4C4", x: 66, y: 74 },
    { id: "R4C41", x: 72, y: 74 },
    { id: "R4C5", x: 80, y: 74 },
    { id: "R4C51", x: 86, y: 74 },
    { id: "R4C6", x: 94, y: 74 },
    { id: "R4C61", x: 100, y: 74 },

    //===Row 41 (y=82)===
    { id:"R41C0", x: 12, y: 82 },
    { id:"R41C01", x: 18, y: 82 },
    { id:"R41C1", x: 24, y: 82 },
    { id:"R41C11", x: 30, y: 82 },
    { id:"R41C2", x: 38, y: 82 },
    { id:"R41C21", x: 44, y: 82 },
    { id:"R41C3", x: 52, y: 82 },
    { id:"R41C31", x: 58, y: 82 },
    { id:"R41C4", x: 66, y: 82 },
    { id:"R41C41", x: 72, y: 82 },
    { id:"R41C5", x: 80, y: 82 },
    { id:"R41C51", x: 86, y: 82 },
    { id:"R41C6", x: 94, y: 82 },
    { id:"R41C61", x: 100, y: 82 },

    // === ROW 5 (y = 90) ===
    { id: "R5C0", x: 12, y: 90 },
    { id: "R5C01", x: 18, y: 90 },
    { id: "R5C1", x: 24, y: 90 },
    { id: "R5C11", x: 30, y: 90 },
    { id: "R5C2", x: 38, y: 90 },
    { id: "R5C21", x: 44, y: 90 },
    { id: "R5C3", x: 52, y: 90 },
    { id: "R5C31", x: 58, y: 90 },
    { id: "R5C4", x: 66, y: 90 },
    { id: "R5C41", x: 72, y: 90 },
    { id: "R5C5", x: 80, y: 90 },
    { id: "R5C51", x: 86, y: 90 },
    { id: "R5C6", x: 94, y: 90 },
    { id: "R5C61", x: 100, y: 90 },

    // === ENTRY POINTS ===
    // Top entries
    { id: "T1", x: 38, y: 0 },
    { id: "T2", x: 66, y: 0 },
    { id: "T3", x: 94, y: 0 },
    // Right entries (inline to connect horizontally)
    { id: "RE1", x: 100, y: 26 },
    { id: "RE2", x: 100, y: 50 }, // needs R2.5 row
    { id: "RE3", x: 100, y: 74 },
    // Bottom entries
    { id: "B1", x: 52, y: 100 },
    { id: "B2", x: 80, y: 100 },

    // === MIDDLE ROW for center destination (y = 50) ===
    { id: "M0", x: 12, y: 50 },
    { id: "M1", x: 24, y: 50 },
    { id: "M2", x: 38, y: 50 },
    { id: "M3", x: 52, y: 50 },
    { id: "M4", x: 66, y: 50 },
    { id: "M5", x: 80, y: 50 },
    { id: "M6", x: 94, y: 50 },
];

// All edges are strictly horizontal or vertical
const EDGES: Edge[] = [
    // === DESTINATION CONNECTION ===
    { from: "DEST", to: "M0" },

    // === HORIZONTAL STREETS (rows) ===
    // Row 0
    { from: "R0C0", to: "R0C1" }, { from: "R0C1", to: "R0C2" }, { from: "R0C2", to: "R0C3" },
    { from: "R0C3", to: "R0C4" }, { from: "R0C4", to: "R0C5" }, { from: "R0C5", to: "R0C6" },
    // Row 1
    { from: "R1C0", to: "R1C1" }, { from: "R1C1", to: "R1C2" }, { from: "R1C2", to: "R1C3" },
    { from: "R1C3", to: "R1C4" }, { from: "R1C4", to: "R1C5" }, { from: "R1C5", to: "R1C6" },
    // Row 2
    { from: "R2C0", to: "R2C1" }, { from: "R2C1", to: "R2C2" }, { from: "R2C2", to: "R2C3" },
    { from: "R2C3", to: "R2C4" }, { from: "R2C4", to: "R2C5" }, { from: "R2C5", to: "R2C6" },
    // Middle Row
    { from: "M0", to: "M1" }, { from: "M1", to: "M2" }, { from: "M2", to: "M3" },
    { from: "M3", to: "M4" }, { from: "M4", to: "M5" }, { from: "M5", to: "M6" },
    // Row 3
    { from: "R3C0", to: "R3C1" }, { from: "R3C1", to: "R3C2" }, { from: "R3C2", to: "R3C3" },
    { from: "R3C3", to: "R3C4" }, { from: "R3C4", to: "R3C5" }, { from: "R3C5", to: "R3C6" },
    // Row 4
    { from: "R4C0", to: "R4C1" }, { from: "R4C1", to: "R4C2" }, { from: "R4C2", to: "R4C3" },
    { from: "R4C3", to: "R4C4" }, { from: "R4C4", to: "R4C5" }, { from: "R4C5", to: "R4C6" },
    // Row 5
    { from: "R5C0", to: "R5C1" }, { from: "R5C1", to: "R5C2" }, { from: "R5C2", to: "R5C3" },
    { from: "R5C3", to: "R5C4" }, { from: "R5C4", to: "R5C5" }, { from: "R5C5", to: "R5C6" },

    // === VERTICAL STREETS (columns) ===
    // Column 0
    { from: "R0C01", to: "R1C0" }, { from: "R1C0", to: "R2C0" }, { from: "R2C0", to: "M0" },
    { from: "M0", to: "R3C0" }, { from: "R3C0", to: "R4C0" }, { from: "R4C0", to: "R5C0" },
    // Column 1
    { from: "R0C1", to: "R1C1" }, { from: "R1C1", to: "R2C1" }, { from: "R2C1", to: "M1" },
    { from: "M1", to: "R3C1" }, { from: "R3C1", to: "R4C1" }, { from: "R4C1", to: "R5C1" },
    // Column 2
    { from: "R0C2", to: "R1C2" }, { from: "R1C2", to: "R2C2" }, { from: "R2C2", to: "M2" },
    { from: "M2", to: "R3C2" }, { from: "R3C2", to: "R4C2" }, { from: "R4C2", to: "R5C2" },
    // Column 3
    { from: "R0C3", to: "R1C3" }, { from: "R1C3", to: "R2C3" }, { from: "R2C3", to: "M3" },
    { from: "M3", to: "R3C3" }, { from: "R3C3", to: "R4C3" }, { from: "R4C3", to: "R5C3" },
    // Column 4
    { from: "R0C4", to: "R1C4" }, { from: "R1C4", to: "R2C4" }, { from: "R2C4", to: "M4" },
    { from: "M4", to: "R3C4" }, { from: "R3C4", to: "R4C4" }, { from: "R4C4", to: "R5C4" },
    // Column 5
    { from: "R0C5", to: "R1C5" }, { from: "R1C5", to: "R2C5" }, { from: "R2C5", to: "M5" },
    { from: "M5", to: "R3C5" }, { from: "R3C5", to: "R4C5" }, { from: "R4C5", to: "R5C5" },
    // Column 6
    { from: "R0C6", to: "R1C6" }, { from: "R1C6", to: "R2C6" }, { from: "R2C6", to: "M6" },
    { from: "M6", to: "R3C6" }, { from: "R3C6", to: "R4C6" }, { from: "R4C6", to: "R5C6" },

    // === ENTRY CONNECTIONS ===
    // Top entries (vertical)
    { from: "T1", to: "R0C2" },
    { from: "T2", to: "R0C4" },
    { from: "T3", to: "R0C6" },
    // Right entries (horizontal)
    { from: "RE1", to: "R1C6" },
    { from: "RE2", to: "M6" },
    { from: "RE3", to: "R4C6" },
    // Bottom entries (vertical)
    { from: "B1", to: "R5C3" },
    { from: "B2", to: "R5C5" },
];

// ===== GRAPH UTILITIES =====

const createAdjacencyList = () => {
    const adj: { [key: string]: string[] } = {};
    NODES.forEach(n => adj[n.id] = []);
    EDGES.forEach(({ from, to }) => {
        adj[from].push(to);
        adj[to].push(from);
    });
    return adj;
};

const ADJACENCY = createAdjacencyList();

const findPath = (startId: string, targetId: string): string[] => {
    const visited = new Set<string>();
    const queue: { node: string; path: string[] }[] = [{ node: startId, path: [startId] }];
    visited.add(startId);

    while (queue.length > 0) {
        const { node, path } = queue.shift()!;
        if (node === targetId) return path;

        for (const neighbor of ADJACENCY[node] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ node: neighbor, path: [...path, neighbor] });
            }
        }
    }
    return [startId];
};

const getNode = (id: string) => NODES.find(n => n.id === id);

// ===== TRAVELERS =====

interface Traveler {
    id: number;
    color: string;
    path: { x: number; y: number }[];
    duration: number;
    delay: number;
}

const COLORS = [
    "rgb(20 184 166)",  // teal
    "rgb(139 92 246)",  // violet
    "rgb(6 182 212)",   // cyan
    "rgb(168 85 247)",  // purple
    "rgb(251 146 60)",  // orange
    "rgb(244 114 182)", // pink
];

const generateTravelers = (): Traveler[] => {
    const routes = [
        { start: "RE2", color: COLORS[0], duration: 14, delay: 0 },
        { start: "T2", color: COLORS[1], duration: 16, delay: 3 },
        { start: "B1", color: COLORS[2], duration: 15, delay: 6 },
        { start: "RE3", color: COLORS[3], duration: 17, delay: 9 },
        { start: "T1", color: COLORS[4], duration: 14, delay: 12 },
        { start: "B2", color: COLORS[5], duration: 16, delay: 15 },
    ];

    return routes.map((route, i) => {
        const pathIds = findPath(route.start, "DEST");
        const coords = pathIds.map(id => getNode(id)).filter(Boolean) as Node[];

        return {
            id: i,
            color: route.color,
            path: coords.map(n => ({ x: n.x, y: n.y })),
            duration: route.duration,
            delay: route.delay,
        };
    });
};

// ===== COMPONENTS =====

function Road({ from, to, isActive }: { from: Node; to: Node; isActive: boolean }) {
    return (
        <motion.line
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke={isActive ? "rgb(20 184 166)" : "rgb(150 150 160 / 0.25)"}
            strokeWidth={isActive ? 2.5 : 1}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            style={{
                filter: isActive ? "drop-shadow(0 0 6px rgb(20 184 166))" : "none",
            }}
            transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
        />
    );
}

function Intersection({ node, isActive }: { node: Node; isActive: boolean }) {
    // Don't render entry points
    if (node.id.startsWith("T") || node.id.startsWith("RE") || node.id.startsWith("B") || node.id === "DEST") {
        return null;
    }

    return (
        <motion.circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={isActive ? 3 : 1.5}
            fill={isActive ? "rgb(20 184 166)" : "rgb(130 130 140 / 0.4)"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
                filter: isActive ? "drop-shadow(0 0 6px rgb(20 184 166))" : "none",
            }}
            transition={{ duration: 0.2, delay: 0.2 + Math.random() * 0.15 }}
        />
    );
}

function TravelerDot({
    traveler,
    onPositionUpdate,
}: {
    traveler: Traveler;
    onPositionUpdate: (id: number, x: number, y: number) => void;
}) {
    const [pos, setPos] = useState(traveler.path[0] || { x: 50, y: 50 });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (traveler.path.length < 2) return;

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp + traveler.delay * 1000;
            if (timestamp < startTime) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const elapsed = timestamp - startTime;
            const totalDuration = traveler.duration * 1000;
            let progress = (elapsed % (totalDuration + 4000)) / totalDuration;

            if (progress > 1) {
                progress = 0;
                startTime = timestamp + 4000;
            }

            const segmentCount = traveler.path.length - 1;
            const segmentIndex = Math.min(Math.floor(progress * segmentCount), segmentCount - 1);
            const segmentProgress = (progress * segmentCount) - segmentIndex;

            const from = traveler.path[segmentIndex];
            const to = traveler.path[segmentIndex + 1];

            const eased = segmentProgress < 0.5
                ? 2 * segmentProgress * segmentProgress
                : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;

            const x = from.x + (to.x - from.x) * eased;
            const y = from.y + (to.y - from.y) * eased;

            setPos({ x, y });
            onPositionUpdate(traveler.id, x, y);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [traveler, onPositionUpdate]);

    return (
        <g>
            <motion.circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={12}
                fill={traveler.color.replace(")", " / 0.1)")}
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity }}
            />
            <motion.circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={4}
                fill={traveler.color}
                style={{ filter: `drop-shadow(0 0 8px ${traveler.color})` }}
            />
            <motion.circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={8}
                fill="none"
                stroke={traveler.color}
                strokeWidth={1}
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
            />
        </g>
    );
}

// ===== MAIN =====

export default function CityMapVisualization() {
    const [positions, setPositions] = useState<{ [id: number]: { x: number; y: number } }>({});
    const travelers = useMemo(() => generateTravelers(), []);

    const handleUpdate = useCallback((id: number, x: number, y: number) => {
        setPositions(prev => ({ ...prev, [id]: { x, y } }));
    }, []);

    const isEdgeActive = useCallback((from: Node, to: Node): boolean => {
        const threshold = 6;
        for (const pos of Object.values(positions)) {
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = dx * dx + dy * dy;
            const t = len > 0 ? Math.max(0, Math.min(1, ((pos.x - from.x) * dx + (pos.y - from.y) * dy) / len)) : 0;
            const nearestX = from.x + t * dx;
            const nearestY = from.y + t * dy;
            const dist = Math.sqrt(Math.pow(pos.x - nearestX, 2) + Math.pow(pos.y - nearestY, 2));
            if (dist < threshold) return true;
        }
        return false;
    }, [positions]);

    const isNodeActive = useCallback((node: Node): boolean => {
        for (const pos of Object.values(positions)) {
            if (Math.sqrt(Math.pow(pos.x - node.x, 2) + Math.pow(pos.y - node.y, 2)) < 6) return true;
        }
        return false;
    }, [positions]);

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
                {/* Roads */}
                {EDGES.map((edge) => {
                    const from = getNode(edge.from);
                    const to = getNode(edge.to);
                    if (!from || !to) return null;
                    return (
                        <Road
                            key={`${edge.from}-${edge.to}`}
                            from={from}
                            to={to}
                            isActive={isEdgeActive(from, to)}
                        />
                    );
                })}

                {/* Intersections */}
                {NODES.map(node => (
                    <Intersection key={node.id} node={node} isActive={isNodeActive(node)} />
                ))}

                {/* Travelers */}
                {travelers.map(t => (
                    <TravelerDot key={t.id} traveler={t} onPositionUpdate={handleUpdate} />
                ))}

                {/* Destination glow */}
                <motion.circle
                    cx="5%"
                    cy="50%"
                    r={15}
                    fill="rgb(20 184 166 / 0.1)"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                />
            </svg>
        </div>
    );
}
