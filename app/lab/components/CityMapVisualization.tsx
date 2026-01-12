"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";

// Seeded random for consistent city generation
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// City block (building) type
interface CityBlock {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    maxBuildingHeight: number; // Random height when activated
    isActive: boolean;
}

// Traveler dot type
interface Traveler {
    id: number;
    x: number;
    y: number;
    color: string;
    speed: number;
    startDelay: number;
}

// Generate random city blocks
const generateCityBlocks = (count: number, seed: number): CityBlock[] => {
    const blocks: CityBlock[] = [];
    const gridCols = 8;
    const gridRows = 6;
    const cellWidth = 100 / gridCols;
    const cellHeight = 100 / gridRows;

    for (let i = 0; i < count; i++) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols) % gridRows;

        // Add randomness to position within cell
        const offsetX = seededRandom(seed + i * 3) * (cellWidth * 0.3);
        const offsetY = seededRandom(seed + i * 7) * (cellHeight * 0.3);

        // Random size
        const width = cellWidth * (0.4 + seededRandom(seed + i * 11) * 0.4);
        const height = cellHeight * (0.4 + seededRandom(seed + i * 13) * 0.4);

        // Random building height when activated (for 3D effect)
        const maxBuildingHeight = 15 + seededRandom(seed + i * 17) * 35;

        blocks.push({
            id: i,
            x: col * cellWidth + offsetX + 15, // Offset from left edge
            y: row * cellHeight + offsetY + 8,
            width,
            height,
            maxBuildingHeight,
            isActive: false,
        });
    }

    return blocks;
};

// Generate roads (horizontal and vertical lines between blocks)
const generateRoads = (seed: number) => {
    const roads: { x1: number; y1: number; x2: number; y2: number; isHorizontal: boolean }[] = [];

    // Horizontal roads
    for (let i = 0; i < 5; i++) {
        const y = 15 + i * 18 + seededRandom(seed + i * 20) * 5;
        roads.push({
            x1: 10,
            y1: y,
            x2: 95,
            y2: y,
            isHorizontal: true,
        });
    }

    // Vertical roads
    for (let i = 0; i < 7; i++) {
        const x = 18 + i * 12 + seededRandom(seed + i * 30) * 4;
        roads.push({
            x1: x,
            y1: 8,
            x2: x,
            y2: 92,
            isHorizontal: false,
        });
    }

    return roads;
};

// Generate travelers
const generateTravelers = (): Traveler[] => {
    const colors = [
        "rgb(20 184 166)", // teal
        "rgb(139 92 246)", // violet
        "rgb(6 182 212)",  // cyan
        "rgb(34 211 238)", // cyan-lighter
        "rgb(168 85 247)", // purple
    ];

    return [
        { id: 0, x: 85, y: 20, color: colors[0], speed: 12, startDelay: 0 },
        { id: 1, x: 90, y: 45, color: colors[1], speed: 15, startDelay: 2 },
        { id: 2, x: 80, y: 70, color: colors[2], speed: 10, startDelay: 4 },
        { id: 3, x: 95, y: 35, color: colors[3], speed: 18, startDelay: 6 },
        { id: 4, x: 88, y: 80, color: colors[4], speed: 14, startDelay: 8 },
    ];
};

// Building component with activation animation
function CityBlockComponent({
    block,
    isNearTraveler,
    travelerColor,
}: {
    block: CityBlock;
    isNearTraveler: boolean;
    travelerColor: string | null;
}) {
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
                    background: travelerColor
                        ? `${travelerColor.replace(")", " / 0.15)")}`
                        : "transparent",
                }}
                animate={{
                    opacity: isNearTraveler ? 1 : 0,
                    transform: isNearTraveler
                        ? `translate(${block.maxBuildingHeight * 0.15}px, ${block.maxBuildingHeight * 0.15}px)`
                        : "translate(0, 0)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Main building block */}
            <motion.div
                className="absolute inset-0 rounded-sm border transition-colors duration-300"
                style={{
                    borderColor: isNearTraveler
                        ? travelerColor || "rgb(20 184 166 / 0.6)"
                        : "rgb(161 161 170 / 0.15)",
                    background: isNearTraveler
                        ? `linear-gradient(135deg, ${travelerColor?.replace(")", " / 0.25)") || "rgb(20 184 166 / 0.25)"}, transparent)`
                        : "rgb(161 161 170 / 0.03)",
                }}
                animate={{
                    scale: isNearTraveler ? 1.02 : 1,
                    boxShadow: isNearTraveler
                        ? `0 ${block.maxBuildingHeight * 0.3}px ${block.maxBuildingHeight * 0.5}px ${travelerColor?.replace(")", " / 0.2)") || "rgb(20 184 166 / 0.2)"}`
                        : "none",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Building "floors" when active */}
                {isNearTraveler && (
                    <motion.div
                        className="absolute inset-x-1 top-1 bottom-1 flex flex-col gap-px overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(Math.floor(block.maxBuildingHeight / 10))].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-full h-px"
                                style={{ background: travelerColor || "rgb(20 184 166)" }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.2 }}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* 3D extrusion effect when active */}
            <motion.div
                className="absolute rounded-sm"
                style={{
                    left: 2,
                    top: 2,
                    right: -2,
                    bottom: -2,
                    borderRight: `2px solid ${travelerColor || "rgb(20 184 166 / 0.4)"}`,
                    borderBottom: `2px solid ${travelerColor || "rgb(20 184 166 / 0.4)"}`,
                    borderRadius: "0.125rem",
                }}
                animate={{
                    opacity: isNearTraveler ? 0.6 : 0,
                    transform: isNearTraveler
                        ? `translate(${block.maxBuildingHeight * 0.08}px, ${block.maxBuildingHeight * 0.08}px)`
                        : "translate(0, 0)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
        </motion.div>
    );
}

// Traveler dot component
function TravelerDot({
    traveler,
    onPositionUpdate,
}: {
    traveler: Traveler;
    onPositionUpdate: (id: number, x: number, y: number) => void;
}) {
    const controls = useAnimation();

    useEffect(() => {
        const animate = async () => {
            // Wait for start delay
            await new Promise((resolve) => setTimeout(resolve, traveler.startDelay * 1000));

            // Animate toward sidebar (left-center)
            const targetX = 3;
            const targetY = 50 + (traveler.id - 2) * 8; // Converge near center

            await controls.start({
                x: `${targetX - traveler.x}vw`,
                y: `${targetY - traveler.y}vh`,
                transition: {
                    duration: traveler.speed,
                    ease: "linear",
                },
            });

            // Reset and repeat
            controls.set({ x: 0, y: 0 });
            animate();
        };

        animate();

        // Update position periodically
        const interval = setInterval(() => {
            const element = document.getElementById(`traveler-${traveler.id}`);
            if (element) {
                const rect = element.getBoundingClientRect();
                const x = (rect.left / window.innerWidth) * 100;
                const y = (rect.top / window.innerHeight) * 100;
                onPositionUpdate(traveler.id, x, y);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [traveler, controls, onPositionUpdate]);

    return (
        <motion.div
            id={`traveler-${traveler.id}`}
            className="absolute rounded-full"
            style={{
                left: `${traveler.x}%`,
                top: `${traveler.y}%`,
                width: 10,
                height: 10,
                background: traveler.color,
                boxShadow: `0 0 20px ${traveler.color}, 0 0 40px ${traveler.color}`,
            }}
            animate={controls}
        >
            {/* Trailing glow */}
            <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${traveler.color.replace(")", " / 0.3)")}, transparent 70%)`,
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
}

export default function CityMapVisualization() {
    const [seed] = useState(() => Date.now());
    const [travelerPositions, setTravelerPositions] = useState<{ [id: number]: { x: number; y: number } }>({});

    const cityBlocks = useMemo(() => generateCityBlocks(40, seed), [seed]);
    const roads = useMemo(() => generateRoads(seed), [seed]);
    const travelers = useMemo(() => generateTravelers(), []);

    const handlePositionUpdate = useCallback((id: number, x: number, y: number) => {
        setTravelerPositions((prev) => ({ ...prev, [id]: { x, y } }));
    }, []);

    // Check if a block is near any traveler
    const getBlockActivation = useCallback(
        (block: CityBlock): { isActive: boolean; color: string | null } => {
            const threshold = 8; // Distance threshold for activation

            for (const [id, pos] of Object.entries(travelerPositions)) {
                const traveler = travelers.find((t) => t.id === parseInt(id));
                if (!traveler) continue;

                const blockCenterX = block.x + block.width / 2;
                const blockCenterY = block.y + block.height / 2;

                const distance = Math.sqrt(
                    Math.pow(pos.x - blockCenterX, 2) + Math.pow(pos.y - blockCenterY, 2)
                );

                if (distance < threshold) {
                    return { isActive: true, color: traveler.color };
                }
            }

            return { isActive: false, color: null };
        },
        [travelerPositions, travelers]
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
                        stroke="rgb(161 161 170 / 0.12)"
                        strokeWidth={road.isHorizontal ? 1.5 : 1}
                        strokeDasharray={road.isHorizontal ? "none" : "4 2"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 1.5,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Main road to sidebar */}
                <motion.line
                    x1="95%"
                    y1="50%"
                    x2="3%"
                    y2="50%"
                    stroke="rgb(20 184 166 / 0.2)"
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                />
            </svg>

            {/* City blocks layer */}
            {cityBlocks.map((block) => {
                const { isActive, color } = getBlockActivation(block);
                return (
                    <CityBlockComponent
                        key={block.id}
                        block={block}
                        isNearTraveler={isActive}
                        travelerColor={color}
                    />
                );
            })}

            {/* Travelers layer */}
            {travelers.map((traveler) => (
                <TravelerDot
                    key={traveler.id}
                    traveler={traveler}
                    onPositionUpdate={handlePositionUpdate}
                />
            ))}

            {/* Sidebar destination glow */}
            <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-32"
                style={{
                    background: "linear-gradient(to right, rgb(20 184 166 / 0.3), transparent)",
                }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
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
