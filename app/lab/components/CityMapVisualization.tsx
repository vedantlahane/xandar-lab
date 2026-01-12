"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// Seeded random for consistent city generation
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Building colors palette
const BUILDING_COLORS = [
    { base: "rgb(20 184 166)", glow: "rgb(20 184 166 / 0.3)" },      // teal
    { base: "rgb(139 92 246)", glow: "rgb(139 92 246 / 0.3)" },      // violet
    { base: "rgb(6 182 212)", glow: "rgb(6 182 212 / 0.3)" },        // cyan
    { base: "rgb(34 211 238)", glow: "rgb(34 211 238 / 0.3)" },      // cyan-light
    { base: "rgb(168 85 247)", glow: "rgb(168 85 247 / 0.3)" },      // purple
    { base: "rgb(59 130 246)", glow: "rgb(59 130 246 / 0.3)" },      // blue
    { base: "rgb(16 185 129)", glow: "rgb(16 185 129 / 0.3)" },      // emerald
    { base: "rgb(244 114 182)", glow: "rgb(244 114 182 / 0.3)" },    // pink
];

// City block (building) type
interface CityBlock {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    maxBuildingHeight: number;
    color: typeof BUILDING_COLORS[0];
    row: number;
    col: number;
}

// Traveler type
interface Traveler {
    id: number;
    color: string;
    speed: number;
    startDelay: number;
    startEdge: "top" | "right" | "bottom";
    path: { x: number; y: number }[];
}

// City grid configuration
const GRID_COLS = 10;
const GRID_ROWS = 7;
const STREET_WIDTH = 2; // percentage
const BLOCK_MARGIN = 0.5; // percentage

// Generate proper city grid with aligned blocks and streets
const generateCityGrid = (seed: number): { blocks: CityBlock[]; roads: { x1: number; y1: number; x2: number; y2: number; isMain: boolean }[] } => {
    const blocks: CityBlock[] = [];
    const roads: { x1: number; y1: number; x2: number; y2: number; isMain: boolean }[] = [];

    // Calculate cell dimensions
    const startX = 12; // Leave space for sidebar
    const endX = 95;
    const startY = 5;
    const endY = 95;

    const totalWidth = endX - startX;
    const totalHeight = endY - startY;

    const cellWidth = (totalWidth - (GRID_COLS + 1) * STREET_WIDTH) / GRID_COLS;
    const cellHeight = (totalHeight - (GRID_ROWS + 1) * STREET_WIDTH) / GRID_ROWS;

    let blockId = 0;

    // Generate horizontal roads (main streets)
    for (let row = 0; row <= GRID_ROWS; row++) {
        const y = startY + row * (cellHeight + STREET_WIDTH);
        roads.push({
            x1: startX - 2,
            y1: y,
            x2: endX,
            y2: y,
            isMain: row % 2 === 0,
        });
    }

    // Generate vertical roads
    for (let col = 0; col <= GRID_COLS; col++) {
        const x = startX + col * (cellWidth + STREET_WIDTH);
        roads.push({
            x1: x,
            y1: startY - 2,
            x2: x,
            y2: endY,
            isMain: col % 3 === 0,
        });
    }

    // Generate city blocks (buildings)
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            // Some cells can be empty (parks/plazas) - about 15% chance
            if (seededRandom(seed + row * 100 + col) < 0.12) continue;

            const baseX = startX + STREET_WIDTH + col * (cellWidth + STREET_WIDTH);
            const baseY = startY + STREET_WIDTH + row * (cellHeight + STREET_WIDTH);

            // Randomize building size within cell (but keep it aligned)
            const widthVariation = seededRandom(seed + blockId * 3) * 0.3;
            const heightVariation = seededRandom(seed + blockId * 7) * 0.3;

            const width = cellWidth * (0.7 + widthVariation) - BLOCK_MARGIN * 2;
            const height = cellHeight * (0.7 + heightVariation) - BLOCK_MARGIN * 2;

            // Center the building in its cell
            const offsetX = (cellWidth - width) / 2;
            const offsetY = (cellHeight - height) / 2;

            // Random building height and color
            const maxBuildingHeight = 10 + seededRandom(seed + blockId * 17) * 30;
            const colorIndex = Math.floor(seededRandom(seed + blockId * 23) * BUILDING_COLORS.length);

            blocks.push({
                id: blockId++,
                x: baseX + offsetX,
                y: baseY + offsetY,
                width,
                height,
                maxBuildingHeight,
                color: BUILDING_COLORS[colorIndex],
                row,
                col,
            });
        }
    }

    return { blocks, roads };
};

// Generate path through the city (greedy pathfinding)
const generateGreedyPath = (
    startEdge: "top" | "right" | "bottom",
    seed: number,
    blocks: CityBlock[]
): { x: number; y: number }[] => {
    const path: { x: number; y: number }[] = [];
    const targetX = 5; // Sidebar position
    const targetY = 50; // Center height

    // Starting position based on edge
    let currentX: number;
    let currentY: number;

    switch (startEdge) {
        case "top":
            currentX = 20 + seededRandom(seed) * 60;
            currentY = 2;
            break;
        case "bottom":
            currentX = 20 + seededRandom(seed + 1) * 60;
            currentY = 98;
            break;
        case "right":
        default:
            currentX = 98;
            currentY = 15 + seededRandom(seed + 2) * 70;
            break;
    }

    path.push({ x: currentX, y: currentY });

    // Generate waypoints that follow streets (greedy approach)
    const gridCellWidth = 80 / GRID_COLS;
    const gridCellHeight = 90 / GRID_ROWS;

    while (currentX > targetX + 5) {
        // Move toward target with some randomness
        const moveX = gridCellWidth * (0.8 + seededRandom(seed + path.length * 3) * 0.5);
        const moveY = (targetY - currentY) * (0.15 + seededRandom(seed + path.length * 7) * 0.2);

        // Add vertical movement waypoint (following streets)
        if (Math.abs(moveY) > 2) {
            currentY += moveY;
            currentY = Math.max(10, Math.min(90, currentY));
            path.push({ x: currentX, y: currentY });
        }

        // Add horizontal movement waypoint
        currentX -= moveX;
        currentX = Math.max(targetX, currentX);
        path.push({ x: currentX, y: currentY });

        // Prevent infinite loops
        if (path.length > 20) break;
    }

    // Final approach to sidebar
    path.push({ x: targetX, y: targetY });

    return path;
};

// Generate travelers with different start edges
const generateTravelers = (seed: number, blocks: CityBlock[]): Traveler[] => {
    const edges: ("top" | "right" | "bottom")[] = ["right", "top", "bottom", "right", "top"];
    const colors = [
        "rgb(20 184 166)",  // teal
        "rgb(139 92 246)",  // violet
        "rgb(6 182 212)",   // cyan
        "rgb(168 85 247)",  // purple
        "rgb(34 211 238)",  // cyan-light
    ];

    return edges.map((edge, i) => ({
        id: i,
        color: colors[i],
        speed: 10 + i * 3,
        startDelay: i * 3,
        startEdge: edge,
        path: generateGreedyPath(edge, seed + i * 100, blocks),
    }));
};

// Building component
function CityBlockComponent({
    block,
    isNearTraveler,
}: {
    block: CityBlock;
    isNearTraveler: boolean;
}) {
    const buildingHeight = block.maxBuildingHeight;

    return (
        <motion.div
            className="absolute"
            style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.width}%`,
                height: `${block.height}%`,
            }}
        >
            {/* Building shadow when active */}
            <motion.div
                className="absolute inset-0 rounded-sm"
                style={{
                    background: block.color.glow,
                }}
                animate={{
                    opacity: isNearTraveler ? 1 : 0,
                    transform: isNearTraveler
                        ? `translate(${buildingHeight * 0.12}px, ${buildingHeight * 0.12}px)`
                        : "translate(0px, 0px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Main building block */}
            <motion.div
                className="absolute inset-0 rounded-sm border transition-colors duration-300"
                style={{
                    borderColor: isNearTraveler
                        ? block.color.base
                        : "rgb(161 161 170 / 0.2)",
                    background: isNearTraveler
                        ? `linear-gradient(135deg, ${block.color.glow}, transparent)`
                        : "rgb(161 161 170 / 0.05)",
                }}
                animate={{
                    scale: isNearTraveler ? 1.03 : 1,
                    boxShadow: isNearTraveler
                        ? `0 ${buildingHeight * 0.4}px ${buildingHeight * 0.6}px ${block.color.glow.replace("0.3", "0.25")}`
                        : "none",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Building floors when active */}
                {isNearTraveler && (
                    <motion.div
                        className="absolute inset-x-0.5 top-0.5 bottom-0.5 flex flex-col justify-evenly overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(Math.min(4, Math.floor(buildingHeight / 8)))].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-full h-px"
                                style={{ background: block.color.base }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: i * 0.04, duration: 0.15 }}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* 3D extrusion effect */}
            <motion.div
                className="absolute rounded-sm pointer-events-none"
                style={{
                    left: "2px",
                    top: "2px",
                    right: "-2px",
                    bottom: "-2px",
                    borderRight: `2px solid ${block.color.base}`,
                    borderBottom: `2px solid ${block.color.base}`,
                }}
                animate={{
                    opacity: isNearTraveler ? 0.5 : 0,
                    transform: isNearTraveler
                        ? `translate(${buildingHeight * 0.06}px, ${buildingHeight * 0.06}px)`
                        : "translate(0px, 0px)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
        </motion.div>
    );
}

// Traveler component with path-following animation
function TravelerDot({
    traveler,
    onPositionUpdate,
}: {
    traveler: Traveler;
    onPositionUpdate: (id: number, x: number, y: number) => void;
}) {
    const [currentPos, setCurrentPos] = useState({ x: traveler.path[0].x, y: traveler.path[0].y });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        let pathIndex = 0;
        let startTime: number | null = null;
        let segmentStartTime: number;

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp + traveler.startDelay * 1000;
                segmentStartTime = startTime;
            }

            if (timestamp < startTime) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const segmentDuration = (traveler.speed / traveler.path.length) * 1000;
            const elapsed = timestamp - segmentStartTime;
            const progress = Math.min(elapsed / segmentDuration, 1);

            if (pathIndex < traveler.path.length - 1) {
                const from = traveler.path[pathIndex];
                const to = traveler.path[pathIndex + 1];

                const x = from.x + (to.x - from.x) * progress;
                const y = from.y + (to.y - from.y) * progress;

                setCurrentPos({ x, y });
                onPositionUpdate(traveler.id, x, y);

                if (progress >= 1) {
                    pathIndex++;
                    segmentStartTime = timestamp;
                }

                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Reset and restart
                pathIndex = 0;
                startTime = timestamp + 2000; // Wait before restarting
                segmentStartTime = startTime;
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [traveler, onPositionUpdate]);

    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                left: `${currentPos.x}%`,
                top: `${currentPos.y}%`,
                width: "12px",
                height: "12px",
                background: traveler.color,
                boxShadow: `0 0 15px ${traveler.color}, 0 0 30px ${traveler.color}`,
                transform: "translate(-50%, -50%)",
            }}
        >
            {/* Pulse ring */}
            <motion.div
                className="absolute -inset-1 rounded-full"
                style={{
                    border: `1px solid ${traveler.color}`,
                }}
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
            />
        </motion.div>
    );
}

export default function CityMapVisualization() {
    const [seed] = useState(() => Date.now());
    const [travelerPositions, setTravelerPositions] = useState<{ [id: number]: { x: number; y: number } }>({});

    const { blocks, roads } = useMemo(() => generateCityGrid(seed), [seed]);
    const travelers = useMemo(() => generateTravelers(seed, blocks), [seed, blocks]);

    const handlePositionUpdate = useCallback((id: number, x: number, y: number) => {
        setTravelerPositions((prev) => ({ ...prev, [id]: { x, y } }));
    }, []);

    // Check if a block is near any traveler
    const isBlockNearTraveler = useCallback(
        (block: CityBlock): boolean => {
            const threshold = 6;

            for (const pos of Object.values(travelerPositions)) {
                const blockCenterX = block.x + block.width / 2;
                const blockCenterY = block.y + block.height / 2;

                const distance = Math.sqrt(
                    Math.pow(pos.x - blockCenterX, 2) + Math.pow(pos.y - blockCenterY, 2)
                );

                if (distance < threshold) {
                    return true;
                }
            }

            return false;
        },
        [travelerPositions]
    );

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {/* Roads layer */}
            <svg className="absolute inset-0 w-full h-full">
                {roads.map((road, i) => (
                    <motion.line
                        key={`road-${i}`}
                        x1={`${road.x1}%`}
                        y1={`${road.y1}%`}
                        x2={`${road.x2}%`}
                        y2={`${road.y2}%`}
                        stroke={road.isMain ? "rgb(161 161 170 / 0.18)" : "rgb(161 161 170 / 0.1)"}
                        strokeWidth={road.isMain ? 1.5 : 0.8}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            delay: 0.3 + i * 0.03,
                            duration: 1,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Main avenue to sidebar */}
                <motion.line
                    x1="95%"
                    y1="50%"
                    x2="5%"
                    y2="50%"
                    stroke="rgb(20 184 166 / 0.15)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                />
            </svg>

            {/* City blocks layer */}
            {blocks.map((block) => (
                <CityBlockComponent
                    key={block.id}
                    block={block}
                    isNearTraveler={isBlockNearTraveler(block)}
                />
            ))}

            {/* Travelers layer */}
            {travelers.map((traveler) => (
                <TravelerDot
                    key={traveler.id}
                    traveler={traveler}
                    onPositionUpdate={handlePositionUpdate}
                />
            ))}

            {/* Sidebar destination indicator */}
            <motion.div
                className="absolute left-0 top-1/2 w-6 h-24"
                style={{
                    background: "linear-gradient(to right, rgb(20 184 166 / 0.25), transparent)",
                    transform: "translateY(-50%)",
                }}
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
