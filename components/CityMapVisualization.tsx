"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Nodes, NODES } from "@/data/Nodes";
import { Edge, EDGES } from "@/data/edges";

// ===== AERIAL STREET MAP =====
// Pure rectangular grid - only horizontal and vertical streets
// Hollow spaces between streets are 4-sided buildings




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
        const coords = pathIds.map(id => getNode(id)).filter(Boolean) as Nodes[];

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

function Road({ from, to, isActive }: { from: Nodes; to: Nodes; isActive: boolean }) {
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

function Intersection({ node, isActive }: { node: Nodes; isActive: boolean }) {
    // Don't render entry points
    if (node.id.startsWith("T") || node.id.startsWith("RE") || node.id.startsWith("B") || node.id === "DEST") {
        return null;
    }

    return (
        <>
        <text
            x={`${node.x}%`}
            y={`${node.y}%`}
            fontSize="8"
            fill="rgb(200 200 200 / 0.9)"
            textAnchor="middle"
            style={{ pointerEvents: "none", userSelect: "none" }}
        >
            {/* {node.id} */}
        </text>
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
        </>
        
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

    const isEdgeActive = useCallback((from: Nodes, to: Nodes): boolean => {
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

    const isNodeActive = useCallback((node: Nodes): boolean => {
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
