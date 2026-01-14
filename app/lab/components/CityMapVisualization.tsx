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

    { id: "X0Y12", x: 0, y: 12 },
    { id: "X0Y18", x: 0, y: 18 },
    { id: "X0Y26", x: 0, y: 26 },
    { id: "X0Y34", x: 0, y: 34 },
    { id: "X0Y42", x: 0, y: 42 },
    { id: "X0Y50", x: 0, y: 50 },
    { id: "X0Y58", x: 0, y: 58 },
    { id: "X0Y64", x: 0, y: 64 },
    { id: "X0Y74", x: 0, y: 74 },
    { id: "X0Y82", x: 0, y: 82 },
    { id: "X0Y90", x: 0, y: 90 },

    { id: "X4Y12", x: 4, y: 12 },
    { id: "X4Y18", x: 4, y: 18 },
    { id: "X4Y26", x: 4, y: 26 },
    { id: "X4Y34", x: 4, y: 34 },
    { id: "X4Y42", x: 4, y: 42 },
    { id: "X4Y50", x: 4, y: 50 },
    { id: "X4Y58", x: 4, y: 58 },
    { id: "X4Y64", x: 4, y: 64 },
    { id: "X4Y74", x: 4, y: 74 },
    { id: "X4Y82", x: 4, y: 82 },
    { id: "X4Y90", x: 4, y: 90 },

    { id: "X12Y10", x: 12, y: 10 },
    { id: "X18Y10", x: 18, y: 10 },
    { id: "X24Y10", x: 24, y: 10 },
    { id: "X30Y10", x: 30, y: 10 },
    { id: "X38Y10", x: 38, y: 10 },
    { id: "X44Y10", x: 44, y: 10 },
    { id: "X52Y10", x: 52, y: 10 },
    { id: "X58Y10", x: 58, y: 10 },
    { id: "X66Y10", x: 66, y: 10 },
    { id: "X72Y10", x: 72, y: 10 },
    { id: "X80Y10", x: 80, y: 10 },
    { id: "X86Y10", x: 86, y: 10 },
    { id: "X94Y10", x: 94, y: 10 },
    { id: "X100Y10", x: 100, y: 10 },


    { id: "X12Y18", x: 12, y: 18 },
    { id: "X18Y18", x: 18, y: 18 },
    { id: "X24Y18", x: 24, y: 18 },
    { id: "X30Y18", x: 30, y: 18 },
    { id: "X38Y18", x: 38, y: 18 },
    { id: "X44Y18", x: 44, y: 18 },
    { id: "X52Y18", x: 52, y: 18 },
    { id: "X58Y18", x: 58, y: 18 },
    { id: "X66Y18", x: 66, y: 18 },
    { id: "X72Y18", x: 72, y: 18 },
    { id: "X80Y18", x: 80, y: 18 },
    { id: "X86Y18", x: 86, y: 18 },
    { id: "X94Y18", x: 94, y: 18 },
    { id: "X100Y18", x: 100, y: 18 },


    { id: "X12Y26", x: 12, y: 26 },
    { id: "X18Y26", x: 18, y: 26 },
    { id: "X24Y26", x: 24, y: 26 },
    { id: "X30Y26", x: 30, y: 26 },
    { id: "X38Y26", x: 38, y: 26 },
    { id: "X44Y26", x: 44, y: 26 },
    { id: "X52Y26", x: 52, y: 26 },
    { id: "X58Y26", x: 58, y: 26 },
    { id: "X66Y26", x: 66, y: 26 },
    { id: "X72Y26", x: 72, y: 26 },
    { id: "X80Y26", x: 80, y: 26 },
    { id: "X86Y26", x: 86, y: 26 },
    { id: "X94Y26", x: 94, y: 26 },
    { id: "X100Y26", x: 100, y: 26 },
    
    { id: "X12Y34", x: 12, y: 34 },
    { id: "X18Y34", x: 18, y: 34 },
    { id: "X24Y34", x: 24, y: 34 },
    { id: "X30Y34", x: 30, y: 34 },
    { id: "X38Y34", x: 38, y: 34 },
    { id: "X44Y34", x: 44, y: 34 },
    { id: "X52Y34", x: 52, y: 34 },
    { id: "X58Y34", x: 58, y: 34 },
    { id: "X66Y34", x: 66, y: 34 },
    { id: "X72Y34", x: 72, y: 34 },
    { id: "X80Y34", x: 80, y: 34 },
    { id: "X86Y34", x: 86, y: 34 },
    { id: "X94Y34", x: 94, y: 34 },
    { id: "X100Y34", x: 100, y: 34 },

    { id: "X12Y42", x: 12, y: 42 },
    { id: "X18Y42", x: 18, y: 42 },
    { id: "X24Y42", x: 24, y: 42 },
    { id: "X30Y42", x: 30, y: 42 },
    { id: "X38Y42", x: 38, y: 42 },
    { id: "X44Y42", x: 44, y: 42 },
    { id: "X52Y42", x: 52, y: 42 },
    { id: "X58Y42", x: 58, y: 42 },
    { id: "X66Y42", x: 66, y: 42 },
    { id: "X72Y42", x: 72, y: 42 },
    { id: "X80Y42", x: 80, y: 42 },
    { id: "X86Y42", x: 86, y: 42 },
    { id: "X94Y42", x: 94, y: 42 },
    { id: "X100Y42", x: 100, y: 42 },

    { id:"X12Y50", x: 12, y: 50 },
    { id:"X18Y50", x: 18, y: 50 },
    { id:"X24Y50", x: 24, y: 50 },
    { id:"X30Y50", x: 30, y: 50 },
    { id:"X38Y50", x: 38, y: 50 },
    { id:"X44Y50", x: 44, y: 50 },
    { id:"X52Y50", x: 52, y: 50 }, 
    { id:"X58Y50", x: 58, y: 50 },
    { id:"X66Y50", x: 66, y: 50 },
    { id:"X72Y50", x: 72, y: 50 },
    { id:"X80Y50", x: 80, y: 50 },
    { id:"X86Y50", x: 86, y: 50 },
    { id:"X94Y50", x: 94, y: 50 },
    { id:"X100Y50", x: 100, y: 50 },



    { id: "X12Y58", x: 12, y: 58 },
    { id: "X18Y58", x: 18, y: 58 },
    { id: "X24Y58", x: 24, y: 58 },
    { id: "X30Y58", x: 30, y: 58 },
    { id: "X38Y58", x: 38, y: 58 },
    { id: "X44Y58", x: 44, y: 58 },
    { id: "X52Y58", x: 52, y: 58 },
    { id: "X58Y58", x: 58, y: 58 },
    { id: "X66Y58", x: 66, y: 58 },
    { id: "X72Y58", x: 72, y: 58 },
    { id: "X80Y58", x: 80, y: 58 },
    { id: "X86Y58", x: 86, y: 58 },
    { id: "X94Y58", x: 94, y: 58 },
    { id: "X100Y58", x: 100, y: 58 },


    { id: "X12Y64", x: 12, y: 64 },
    { id: "X18Y64", x: 18, y: 64 },
    { id: "X24Y64", x: 24, y: 64 },
    { id: "X30Y64", x: 30, y: 64 },
    { id: "X38Y64", x: 38, y: 64 },
    { id: "X44Y64", x: 44, y: 64 },
    { id: "X52Y64", x: 52, y: 64 },
    { id: "X58Y64", x: 58, y: 64 },
    { id: "X66Y64", x: 66, y: 64 },
    { id: "X72Y64", x: 72, y: 64 },
    { id: "X80Y64", x: 80, y: 64 },
    { id: "X86Y64", x: 86, y: 64 },
    { id: "X94Y64", x: 94, y: 64 },
    { id: "X100Y64", x: 100, y: 64 },

    { id: "X12Y74", x: 12, y: 74 },
    { id: "X18Y74", x: 18, y: 74 },
    { id: "X24Y74", x: 24, y: 74 },
    { id: "X30Y74", x: 30, y: 74 },
    { id: "X38Y74", x: 38, y: 74 },
    { id: "X44Y74", x: 44, y: 74 },
    { id: "X52Y74", x: 52, y: 74 },
    { id: "X58Y74", x: 58, y: 74 },
    { id: "X66Y74", x: 66, y: 74 },
    { id: "X72Y74", x: 72, y: 74 },
    { id: "X80Y74", x: 80, y: 74 },
    { id: "X86Y74", x: 86, y: 74 },
    { id: "X94Y74", x: 94, y: 74 },
    { id: "X100Y74", x: 100, y: 74 },

    { id:"X12Y82", x: 12, y: 82 },
    { id:"X18Y82", x: 18, y: 82 },
    { id:"X24Y82", x: 24, y: 82 },
    { id:"X30Y82", x: 30, y: 82 },
    { id:"X38Y82", x: 38, y: 82 },
    { id:"X44Y82", x: 44, y: 82 },
    { id:"X52Y82", x: 52, y: 82 },
    { id:"X58Y82", x: 58, y: 82 },
    { id:"X66Y82", x: 66, y: 82 },
    { id:"X72Y82", x: 72, y: 82 },
    { id:"X80Y82", x: 80, y: 82 },
    { id:"X86Y82", x: 86, y: 82 },
    { id:"X94Y82", x: 94, y: 82 },
    { id:"X100Y82", x: 100, y: 82 },


    { id: "X12Y90", x: 12, y: 90 },
    { id: "X18Y90", x: 18, y: 90 },
    { id: "X24Y90", x: 24, y: 90 },
    { id: "X30Y90", x: 30, y: 90 },
    { id: "X38Y90", x: 38, y: 90 },
    { id: "X44Y90", x: 44, y: 90 },
    { id: "X52Y90", x: 52, y: 90 },
    { id: "X58Y90", x: 58, y: 90 },
    { id: "X66Y90", x: 66, y: 90 },
    { id: "X72Y90", x: 72, y: 90 },
    { id: "X80Y90", x: 80, y: 90 },
    { id: "X86Y90", x: 86, y: 90 },
    { id: "X94Y90", x: 94, y: 90 },
    { id: "X100Y90", x: 100, y: 90 },

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
];

// All edges are strictly horizontal or vertical
const EDGES: Edge[] = [
    // === DESTINATION CONNECTION ===
    { from: "DEST", to: "X4Y50" },
    // { from: "X4Y50", to: "X12Y50" },

    { from: "X4Y12", to: "X0Y12" },
    { from: "X0Y12", to: "X0Y18" },
    { from: "X0Y18", to: "X0Y26" },
    { from: "X0Y26", to: "X0Y34" },
    { from: "X0Y34", to: "X0Y42" },
    { from: "X0Y42", to: "X0Y50" },
    { from: "X0Y50", to: "X0Y58" },
    { from: "X0Y58", to: "X0Y64" },
    { from: "X0Y64", to: "X0Y74" },
    { from: "X0Y74", to: "X0Y82" },
    { from: "X0Y82", to: "X0Y90" },
    { from: "X12Y10", to: "X18Y10" },
    { from: "X18Y10", to: "X24Y10" },
    { from: "X24Y10", to: "X30Y10" },
    { from: "X30Y10", to: "X38Y10" },
    { from: "X38Y10", to: "X44Y10" },
    { from: "X44Y10", to: "X52Y10" },
    { from: "X52Y10", to: "X58Y10" },
    { from: "X58Y10", to: "X66Y10" },
    { from: "X66Y10", to: "X72Y10" },
    { from: "X72Y10", to: "X80Y10" },
    { from: "X80Y10", to: "X86Y10" },
    { from: "X86Y10", to: "X94Y10" },
    { from: "X94Y10", to: "X100Y10" },

    { from: "X4Y18", to: "X12Y18" },
    { from: "X12Y18", to: "X18Y18" },
    { from: "X18Y18", to: "X24Y18" },
    { from: "X24Y18", to: "X30Y18" },
    { from: "X30Y18", to: "X38Y18" },
    { from: "X38Y18", to: "X44Y18" },
    { from: "X44Y18", to: "X52Y18" },
    { from: "X52Y18", to: "X58Y18" },
    { from: "X58Y18", to: "X66Y18" },
    { from: "X66Y18", to: "X72Y18" },
    { from: "X72Y18", to: "X80Y18" },
    { from: "X80Y18", to: "X86Y18" },
    { from: "X86Y18", to: "X94Y18" },
    { from: "X94Y18", to: "X100Y18" },

    { from: "X4Y26", to: "X12Y26" },
    { from: "X12Y26", to: "X18Y26" },
    { from: "X18Y26", to: "X24Y26" },
    { from: "X24Y26", to: "X30Y26" },
    { from: "X30Y26", to: "X38Y26" },
    { from: "X38Y26", to: "X44Y26" },
    { from: "X44Y26", to: "X52Y26" },
    { from: "X52Y26", to: "X58Y26" },
    { from: "X58Y26", to: "X66Y26" },
    { from: "X66Y26", to: "X72Y26" },
    { from: "X72Y26", to: "X80Y26" },
    { from: "X80Y26", to: "X86Y26" },
    { from: "X86Y26", to: "X94Y26" },
    { from: "X94Y26", to: "X100Y26" },

    { from: "X4Y34", to: "X12Y34" },
    { from: "X12Y34", to: "X18Y34" },
    { from: "X18Y34", to: "X24Y34" },
    { from: "X24Y34", to: "X30Y34" },
    { from: "X30Y34", to: "X38Y34" },
    { from: "X38Y34", to: "X44Y34" },
    { from: "X44Y34", to: "X52Y34" },
    { from: "X52Y34", to: "X58Y34" },
    { from: "X58Y34", to: "X66Y34" },
    { from: "X66Y34", to: "X72Y34" },
    { from: "X72Y34", to: "X80Y34" },
    { from: "X80Y34", to: "X86Y34" },
    { from: "X86Y34", to: "X94Y34" },
    { from: "X94Y34", to: "X100Y34" },

    { from: "X4Y42", to: "X12Y42" },
    { from: "X12Y42", to: "X18Y42" },
    { from: "X18Y42", to: "X24Y42" },
    { from: "X24Y42", to: "X30Y42" },
    { from: "X30Y42", to: "X38Y42" },
    { from: "X38Y42", to: "X44Y42" },
    { from: "X44Y42", to: "X52Y42" },
    { from: "X52Y42", to: "X58Y42" },
    { from: "X58Y42", to: "X66Y42" },
    { from: "X66Y42", to: "X72Y42" },
    { from: "X72Y42", to: "X80Y42" },
    { from: "X80Y42", to: "X86Y42" },
    { from: "X86Y42", to: "X94Y42" },
    { from: "X94Y42", to: "X100Y42" },

    { from: "X4Y50", to: "X12Y50" },
    { from: "X12Y50", to: "X18Y50" },
    { from: "X18Y50", to: "X24Y50" },
    { from: "X24Y50", to: "X30Y50" },
    { from: "X30Y50", to: "X38Y50" },
    { from: "X38Y50", to: "X44Y50" },
    { from: "X44Y50", to: "X52Y50" },
    { from: "X52Y50", to: "X58Y50" },
    { from: "X58Y50", to: "X66Y50" },
    { from: "X66Y50", to: "X72Y50" },
    { from: "X72Y50", to: "X80Y50" },
    { from: "X80Y50", to: "X86Y50" },
    { from: "X86Y50", to: "X94Y50" },
    { from: "X94Y50", to: "X100Y50" },

    { from: "X4Y58", to: "X12Y58" },
    { from: "X12Y58", to: "X18Y58" },
    { from: "X18Y58", to: "X24Y58" },
    { from: "X24Y58", to: "X30Y58" },
    { from: "X30Y58", to: "X38Y58" },
    { from: "X38Y58", to: "X44Y58" },
    { from: "X44Y58", to: "X52Y58" },
    { from: "X52Y58", to: "X58Y58" },
    { from: "X58Y58", to: "X66Y58" },
    { from: "X66Y58", to: "X72Y58" },
    { from: "X72Y58", to: "X80Y58" },
    { from: "X80Y58", to: "X86Y58" },
    { from: "X86Y58", to: "X94Y58" },
    { from: "X94Y58", to: "X100Y58" },

    { from: "X4Y64", to: "X12Y64" },
    { from: "X12Y64", to: "X18Y64" },
    { from: "X18Y64", to: "X24Y64" },
    { from: "X24Y64", to: "X30Y64" },
    { from: "X30Y64", to: "X38Y64" },
    { from: "X38Y64", to: "X44Y64" },
    { from: "X44Y64", to: "X52Y64" },
    { from: "X52Y64", to: "X58Y64" },
    { from: "X58Y64", to: "X66Y64" },
    { from: "X66Y64", to: "X72Y64" },
    { from: "X72Y64", to: "X80Y64" },
    { from: "X80Y64", to: "X86Y64" },
    { from: "X86Y64", to: "X94Y64" },
    { from: "X94Y64", to: "X100Y64" },

    { from: "X4Y74", to: "X12Y74" },
    { from: "X12Y74", to: "X18Y74" },
    { from: "X18Y74", to: "X24Y74" },
    { from: "X24Y74", to: "X30Y74" },
    { from: "X30Y74", to: "X38Y74" },
    { from: "X38Y74", to: "X44Y74" },
    { from: "X44Y74", to: "X52Y74" },
    { from: "X52Y74", to: "X58Y74" },
    { from: "X58Y74", to: "X66Y74" },
    { from: "X66Y74", to: "X72Y74" },
    { from: "X72Y74", to: "X80Y74" },
    { from: "X80Y74", to: "X86Y74" },
    { from: "X86Y74", to: "X94Y74" },
    { from: "X94Y74", to: "X100Y74" },

    { from: "X4Y82", to: "X12Y82" },
    { from: "X12Y82", to: "X18Y82" },
    { from: "X18Y82", to: "X24Y82" },
    { from: "X24Y82", to: "X30Y82" },
    { from: "X30Y82", to: "X38Y82" },
    { from: "X38Y82", to: "X44Y82" },
    { from: "X44Y82", to: "X52Y82" },
    { from: "X52Y82", to: "X58Y82" },
    { from: "X58Y82", to: "X66Y82" },
    { from: "X66Y82", to: "X72Y82" },
    { from: "X72Y82", to: "X80Y82" },
    { from: "X80Y82", to: "X86Y82" },
    { from: "X86Y82", to: "X94Y82" },
    { from: "X94Y82", to: "X100Y82" },

    { from: "X0Y90", to: "X4Y90" },

    { from: "X4Y90", to: "X12Y90" },
    { from: "X12Y90", to: "X18Y90" },
    { from: "X18Y90", to: "X24Y90" },
    { from: "X24Y90", to: "X30Y90" },
    { from: "X30Y90", to: "X38Y90" },
    { from: "X38Y90", to: "X44Y90" },
    { from: "X44Y90", to: "X52Y90" },
    { from: "X52Y90", to: "X58Y90" },
    { from: "X58Y90", to: "X66Y90" },
    { from: "X66Y90", to: "X72Y90" },
    { from: "X72Y90", to: "X80Y90" },
    { from: "X80Y90", to: "X86Y90" },
    { from: "X86Y90", to: "X94Y90" },
    { from: "X94Y90", to: "X100Y90" },


    
    
    { from: "X4Y18", to: "X4Y26" },
    { from: "X4Y26", to: "X4Y34" },
    { from: "X4Y34", to: "X4Y42" },
    { from: "X4Y42", to: "X4Y50" },
    { from: "X4Y50", to: "X4Y58" },
    { from: "X4Y58", to: "X4Y64" },
    { from: "X4Y64", to: "X4Y74" },
    { from: "X4Y74", to: "X4Y82" },
    // { from: "X4Y82", to: "X4Y90" },

    { from: "X12Y10", to: "X12Y18" },
    { from: "X12Y18", to: "X12Y26" },
    { from: "X12Y26", to: "X12Y34" },
    { from: "X12Y34", to: "X12Y42" },
    { from: "X12Y42", to: "X12Y50" },
    { from: "X12Y50", to: "X12Y58" },
    { from: "X12Y58", to: "X12Y64" },
    { from: "X12Y64", to: "X12Y74" },
    { from: "X12Y74", to: "X12Y82" },
    { from: "X12Y82", to: "X12Y90" },

    { from: "X18Y10", to: "X18Y18" },
    { from: "X18Y18", to: "X18Y26" },
    { from: "X18Y26", to: "X18Y34" },
    { from: "X18Y34", to: "X18Y42" },
    { from: "X18Y42", to: "X18Y50" },
    { from: "X18Y50", to: "X18Y58" },
    { from: "X18Y58", to: "X18Y64" },
    { from: "X18Y64", to: "X18Y74" },
    { from: "X18Y74", to: "X18Y82" },
    { from: "X18Y82", to: "X18Y90" },

    { from: "X24Y10", to: "X24Y18" },
    { from: "X24Y18", to: "X24Y26" },
    { from: "X24Y26", to: "X24Y34" },
    { from: "X24Y34", to: "X24Y42" },
    { from: "X24Y42", to: "X24Y50" },
    { from: "X24Y50", to: "X24Y58" },
    { from: "X24Y58", to: "X24Y64" },
    { from: "X24Y64", to: "X24Y74" },
    { from: "X24Y74", to: "X24Y82" },
    { from: "X24Y82", to: "X24Y90" },

    { from: "X30Y10", to: "X30Y18" },
    { from: "X30Y18", to: "X30Y26" },
    { from: "X30Y26", to: "X30Y34" },
    { from: "X30Y34", to: "X30Y42" },
    { from: "X30Y42", to: "X30Y50" },
    { from: "X30Y50", to: "X30Y58" },
    { from: "X30Y58", to: "X30Y64" },
    { from: "X30Y64", to: "X30Y74" },
    { from: "X30Y74", to: "X30Y82" },
    { from: "X30Y82", to: "X30Y90" },

    { from: "X38Y10", to: "X38Y18" },
    { from: "X38Y18", to: "X38Y26" },
    { from: "X38Y26", to: "X38Y34" },
    { from: "X38Y34", to: "X38Y42" },
    { from: "X38Y42", to: "X38Y50" },
    { from: "X38Y50", to: "X38Y58" },
    { from: "X38Y58", to: "X38Y64" },
    { from: "X38Y64", to: "X38Y74" },
    { from: "X38Y74", to: "X38Y82" },
    { from: "X38Y82", to: "X38Y90" },

    { from: "X44Y10", to: "X44Y18" },
    { from: "X44Y18", to: "X44Y26" },
    { from: "X44Y26", to: "X44Y34" },
    { from: "X44Y34", to: "X44Y42" },
    { from: "X44Y42", to: "X44Y50" },
    { from: "X44Y50", to: "X44Y58" },
    { from: "X44Y58", to: "X44Y64" },
    { from: "X44Y64", to: "X44Y74" },
    { from: "X44Y74", to: "X44Y82" },
    { from: "X44Y82", to: "X44Y90" },

    { from: "X52Y10", to: "X52Y18" },
    { from: "X52Y18", to: "X52Y26" },
    { from: "X52Y26", to: "X52Y34" },
    { from: "X52Y34", to: "X52Y42" },
    { from: "X52Y42", to: "X52Y50" },
    { from: "X52Y50", to: "X52Y58" },
    { from: "X52Y58", to: "X52Y64" },
    { from: "X52Y64", to: "X52Y74" },
    { from: "X52Y74", to: "X52Y82" },
    { from: "X52Y82", to: "X52Y90" },

    { from: "X58Y10", to: "X58Y18" },
    { from: "X58Y18", to: "X58Y26" },
    { from: "X58Y26", to: "X58Y34" },
    { from: "X58Y34", to: "X58Y42" },
    { from: "X58Y42", to: "X58Y50" },
    { from: "X58Y50", to: "X58Y58" },
    { from: "X58Y58", to: "X58Y64" },
    { from: "X58Y64", to: "X58Y74" },
    { from: "X58Y74", to: "X58Y82" },
    { from: "X58Y82", to: "X58Y90" },

    { from: "X66Y10", to: "X66Y18" },
    { from: "X66Y18", to: "X66Y26" },
    { from: "X66Y26", to: "X66Y34" },
    { from: "X66Y34", to: "X66Y42" },
    { from: "X66Y42", to: "X66Y50" },
    { from: "X66Y50", to: "X66Y58" },
    { from: "X66Y58", to: "X66Y64" },
    { from: "X66Y64", to: "X66Y74" },
    { from: "X66Y74", to: "X66Y82" },
    { from: "X66Y82", to: "X66Y90" },

    { from: "X72Y10", to: "X72Y18" },
    { from: "X72Y18", to: "X72Y26" },
    { from: "X72Y26", to: "X72Y34" },
    { from: "X72Y34", to: "X72Y42" },
    { from: "X72Y42", to: "X72Y50" },
    { from: "X72Y50", to: "X72Y58" },
    { from: "X72Y58", to: "X72Y64" },
    { from: "X72Y64", to: "X72Y74" },
    { from: "X72Y74", to: "X72Y82" },
    { from: "X72Y82", to: "X72Y90" },

    { from: "X80Y10", to: "X80Y18" },
    { from: "X80Y18", to: "X80Y26" },
    { from: "X80Y26", to: "X80Y34" },
    { from: "X80Y34", to: "X80Y42" },
    { from: "X80Y42", to: "X80Y50" },
    { from: "X80Y50", to: "X80Y58" },
    { from: "X80Y58", to: "X80Y64" },
    { from: "X80Y64", to: "X80Y74" },
    { from: "X80Y74", to: "X80Y82" },
    { from: "X80Y82", to: "X80Y90" },

    { from: "X86Y10", to: "X86Y18" },
    { from: "X86Y18", to: "X86Y26" },
    { from: "X86Y26", to: "X86Y34" },
    { from: "X86Y34", to: "X86Y42" },
    { from: "X86Y42", to: "X86Y50" },
    { from: "X86Y50", to: "X86Y58" },
    { from: "X86Y58", to: "X86Y64" },
    { from: "X86Y64", to: "X86Y74" },
    { from: "X86Y74", to: "X86Y82" },
    { from: "X86Y82", to: "X86Y90" },

    { from: "X94Y10", to: "X94Y18" },
    { from: "X94Y18", to: "X94Y26" },
    { from: "X94Y26", to: "X94Y34" },
    { from: "X94Y34", to: "X94Y42" },
    { from: "X94Y42", to: "X94Y50" },
    { from: "X94Y50", to: "X94Y58" },
    { from: "X94Y58", to: "X94Y64" },
    { from: "X94Y64", to: "X94Y74" },
    { from: "X94Y74", to: "X94Y82" },
    { from: "X94Y82", to: "X94Y90" },

    { from: "X100Y10", to: "X100Y18" },
    { from: "X100Y18", to: "X100Y26" },
    { from: "X100Y26", to: "X100Y34" },
    { from: "X100Y34", to: "X100Y42" },
    { from: "X100Y42", to: "X100Y50" },
    { from: "X100Y50", to: "X100Y58" },
    { from: "X100Y58", to: "X100Y64" },
    { from: "X100Y64", to: "X100Y74" },
    { from: "X100Y74", to: "X100Y82" },
    { from: "X100Y82", to: "X100Y90" },

    // === ENTRY CONNECTIONS ===
    // Top entries (vertical connections)
    { from: "T1", to: "X38Y10" },
    { from: "T2", to: "X66Y10" },
    { from: "T3", to: "X94Y10" },
    // Right entries (horizontal connections)
    { from: "RE1", to: "X100Y26" },
    { from: "RE2", to: "X100Y50" },
    { from: "RE3", to: "X100Y74" },
    // Bottom entries (vertical connections)
    { from: "B1", to: "X52Y90" },
    { from: "B2", to: "X80Y90" },
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
        <>
        <text
            x={`${node.x}%`}
            y={`${node.y}%`}
            fontSize="12"
            fill="rgb(200 200 200 / 0.9)"
            textAnchor="middle"
            style={{ pointerEvents: "none", userSelect: "none" }}
        >
            {node.id}
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
