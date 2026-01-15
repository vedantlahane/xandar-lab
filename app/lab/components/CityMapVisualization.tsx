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
    // ==========================================
    // 1. SPECIAL / CUSTOM NODES
    // ==========================================
    { id: "DEST", x: 5, y: 50 },

    // Top Entries
    { id: "T1", x: 38, y: 8 },
    { id: "T2", x: 66, y: 8 },
    { id: "T3", x: 94, y: 8 },

    // Right Entries (y=26, 50, 74 are irregular, kept as requested)
    { id: "RE1", x: 92, y: 26 },
    { id: "RE2", x: 80, y: 50 }, 
    { id: "RE3", x: 88, y: 74 },

    // Bottom Entries
    { id: "B1", x: 52, y: 84 },
    { id: "B2", x: 80, y: 76 },


    { id: "X4Y50", x: 4, y: 50 },  // Connects DEST
    { id: "X38Y0", x: 38, y: 0 },  // Connects T1
    { id: "X66Y0", x: 66, y: 0 },  // Connects T2
    { id: "X94Y0", x: 94, y: 0 },  // Connects T3

    // ==========================================
    // 2. STANDARD GRID (Distance 4)
    // ==========================================

    // --- Column X = 0 ---
    { id: "X0Y0", x: 0, y: 0 },
    { id: "X0Y4", x: 0, y: 4 },
    { id: "X0Y8", x: 0, y: 8 },
    { id: "X0Y12", x: 0, y: 12 },
    { id: "X0Y16", x: 0, y: 16 },
    { id: "X0Y20", x: 0, y: 20 },
    { id: "X0Y24", x: 0, y: 24 },
    { id: "X0Y28", x: 0, y: 28 },
    { id: "X0Y32", x: 0, y: 32 },
    { id: "X0Y36", x: 0, y: 36 },
    { id: "X0Y40", x: 0, y: 40 },
    { id: "X0Y44", x: 0, y: 44 },
    { id: "X0Y48", x: 0, y: 48 },
    { id: "X0Y52", x: 0, y: 52 },
    { id: "X0Y56", x: 0, y: 56 },
    { id: "X0Y60", x: 0, y: 60 },
    { id: "X0Y64", x: 0, y: 64 },
    { id: "X0Y68", x: 0, y: 68 },
    { id: "X0Y72", x: 0, y: 72 },
    { id: "X0Y76", x: 0, y: 76 },
    { id: "X0Y80", x: 0, y: 80 },
    { id: "X0Y84", x: 0, y: 84 },
    { id: "X0Y88", x: 0, y: 88 },
    { id: "X0Y92", x: 0, y: 92 },
    { id: "X0Y96", x: 0, y: 96 },
    { id: "X0Y100", x: 0, y: 100 },

    // --- Column X = 4 ---
    { id: "X4Y0", x: 4, y: 0 },
    { id: "X4Y4", x: 4, y: 4 },
    { id: "X4Y8", x: 4, y: 8 },
    { id: "X4Y12", x: 4, y: 12 },
    { id: "X4Y16", x: 4, y: 16 },
    { id: "X4Y20", x: 4, y: 20 },
    { id: "X4Y24", x: 4, y: 24 },
    { id: "X4Y28", x: 4, y: 28 },
    { id: "X4Y32", x: 4, y: 32 },
    { id: "X4Y36", x: 4, y: 36 },
    { id: "X4Y40", x: 4, y: 40 },
    { id: "X4Y44", x: 4, y: 44 },
    { id: "X4Y48", x: 4, y: 48 },
    { id: "X4Y52", x: 4, y: 52 },
    { id: "X4Y56", x: 4, y: 56 },
    { id: "X4Y60", x: 4, y: 60 },
    { id: "X4Y64", x: 4, y: 64 },
    { id: "X4Y68", x: 4, y: 68 },
    { id: "X4Y72", x: 4, y: 72 },
    { id: "X4Y76", x: 4, y: 76 },
    { id: "X4Y80", x: 4, y: 80 },
    { id: "X4Y84", x: 4, y: 84 },
    { id: "X4Y88", x: 4, y: 88 },
    { id: "X4Y92", x: 4, y: 92 },
    { id: "X4Y96", x: 4, y: 96 },
    { id: "X4Y100", x: 4, y: 100 },

    // --- Column X = 8 ---
    { id: "X8Y0", x: 8, y: 0 },
    { id: "X8Y4", x: 8, y: 4 },
    { id: "X8Y8", x: 8, y: 8 },
    { id: "X8Y12", x: 8, y: 12 },
    { id: "X8Y16", x: 8, y: 16 },
    { id: "X8Y20", x: 8, y: 20 },
    { id: "X8Y24", x: 8, y: 24 },
    { id: "X8Y28", x: 8, y: 28 },
    { id: "X8Y32", x: 8, y: 32 },
    { id: "X8Y36", x: 8, y: 36 },
    { id: "X8Y40", x: 8, y: 40 },
    { id: "X8Y44", x: 8, y: 44 },
    { id: "X8Y48", x: 8, y: 48 },
    { id: "X8Y52", x: 8, y: 52 },
    { id: "X8Y56", x: 8, y: 56 },
    { id: "X8Y60", x: 8, y: 60 },
    { id: "X8Y64", x: 8, y: 64 },
    { id: "X8Y68", x: 8, y: 68 },
    { id: "X8Y72", x: 8, y: 72 },
    { id: "X8Y76", x: 8, y: 76 },
    { id: "X8Y80", x: 8, y: 80 },
    { id: "X8Y84", x: 8, y: 84 },
    { id: "X8Y88", x: 8, y: 88 },
    { id: "X8Y92", x: 8, y: 92 },
    { id: "X8Y96", x: 8, y: 96 },
    { id: "X8Y100", x: 8, y: 100 },

    // --- Column X = 12 ---
    { id: "X12Y0", x: 12, y: 0 },
    { id: "X12Y4", x: 12, y: 4 },
    { id: "X12Y8", x: 12, y: 8 },
    { id: "X12Y12", x: 12, y: 12 },
    { id: "X12Y16", x: 12, y: 16 },
    { id: "X12Y20", x: 12, y: 20 },
    { id: "X12Y24", x: 12, y: 24 },
    { id: "X12Y28", x: 12, y: 28 },
    { id: "X12Y32", x: 12, y: 32 },
    { id: "X12Y36", x: 12, y: 36 },
    { id: "X12Y40", x: 12, y: 40 },
    { id: "X12Y44", x: 12, y: 44 },
    { id: "X12Y48", x: 12, y: 48 },
    { id: "X12Y52", x: 12, y: 52 },
    { id: "X12Y56", x: 12, y: 56 },
    { id: "X12Y60", x: 12, y: 60 },
    { id: "X12Y64", x: 12, y: 64 },
    { id: "X12Y68", x: 12, y: 68 },
    { id: "X12Y72", x: 12, y: 72 },
    { id: "X12Y76", x: 12, y: 76 },
    { id: "X12Y80", x: 12, y: 80 },
    { id: "X12Y84", x: 12, y: 84 },
    { id: "X12Y88", x: 12, y: 88 },
    { id: "X12Y92", x: 12, y: 92 },
    { id: "X12Y96", x: 12, y: 96 },
    { id: "X12Y100", x: 12, y: 100 },

    // --- Column X = 16 ---
    { id: "X16Y0", x: 16, y: 0 },
    { id: "X16Y4", x: 16, y: 4 },
    { id: "X16Y8", x: 16, y: 8 },
    { id: "X16Y12", x: 16, y: 12 },
    { id: "X16Y16", x: 16, y: 16 },
    { id: "X16Y20", x: 16, y: 20 },
    { id: "X16Y24", x: 16, y: 24 },
    { id: "X16Y28", x: 16, y: 28 },
    { id: "X16Y32", x: 16, y: 32 },
    { id: "X16Y36", x: 16, y: 36 },
    { id: "X16Y40", x: 16, y: 40 },
    { id: "X16Y44", x: 16, y: 44 },
    { id: "X16Y48", x: 16, y: 48 },
    { id: "X16Y52", x: 16, y: 52 },
    { id: "X16Y56", x: 16, y: 56 },
    { id: "X16Y60", x: 16, y: 60 },
    { id: "X16Y64", x: 16, y: 64 },
    { id: "X16Y68", x: 16, y: 68 },
    { id: "X16Y72", x: 16, y: 72 },
    { id: "X16Y76", x: 16, y: 76 },
    { id: "X16Y80", x: 16, y: 80 },
    { id: "X16Y84", x: 16, y: 84 },
    { id: "X16Y88", x: 16, y: 88 },
    { id: "X16Y92", x: 16, y: 92 },
    { id: "X16Y96", x: 16, y: 96 },
    { id: "X16Y100", x: 16, y: 100 },

    // --- Column X = 20 ---
    { id: "X20Y0", x: 20, y: 0 },
    { id: "X20Y4", x: 20, y: 4 },
    { id: "X20Y8", x: 20, y: 8 },
    { id: "X20Y12", x: 20, y: 12 },
    { id: "X20Y16", x: 20, y: 16 },
    { id: "X20Y20", x: 20, y: 20 },
    { id: "X20Y24", x: 20, y: 24 },
    { id: "X20Y28", x: 20, y: 28 },
    { id: "X20Y32", x: 20, y: 32 },
    { id: "X20Y36", x: 20, y: 36 },
    { id: "X20Y40", x: 20, y: 40 },
    { id: "X20Y44", x: 20, y: 44 },
    { id: "X20Y48", x: 20, y: 48 },
    { id: "X20Y52", x: 20, y: 52 },
    { id: "X20Y56", x: 20, y: 56 },
    { id: "X20Y60", x: 20, y: 60 },
    { id: "X20Y64", x: 20, y: 64 },
    { id: "X20Y68", x: 20, y: 68 },
    { id: "X20Y72", x: 20, y: 72 },
    { id: "X20Y76", x: 20, y: 76 },
    { id: "X20Y80", x: 20, y: 80 },
    { id: "X20Y84", x: 20, y: 84 },
    { id: "X20Y88", x: 20, y: 88 },
    { id: "X20Y92", x: 20, y: 92 },
    { id: "X20Y96", x: 20, y: 96 },
    { id: "X20Y100", x: 20, y: 100 },

    // --- Column X = 24 ---
    { id: "X24Y0", x: 24, y: 0 },
    { id: "X24Y4", x: 24, y: 4 },
    { id: "X24Y8", x: 24, y: 8 },
    { id: "X24Y12", x: 24, y: 12 },
    { id: "X24Y16", x: 24, y: 16 },
    { id: "X24Y20", x: 24, y: 20 },
    { id: "X24Y24", x: 24, y: 24 },
    { id: "X24Y28", x: 24, y: 28 },
    { id: "X24Y32", x: 24, y: 32 },
    { id: "X24Y36", x: 24, y: 36 },
    { id: "X24Y40", x: 24, y: 40 },
    { id: "X24Y44", x: 24, y: 44 },
    { id: "X24Y48", x: 24, y: 48 },
    { id: "X24Y52", x: 24, y: 52 },
    { id: "X24Y56", x: 24, y: 56 },
    { id: "X24Y60", x: 24, y: 60 },
    { id: "X24Y64", x: 24, y: 64 },
    { id: "X24Y68", x: 24, y: 68 },
    { id: "X24Y72", x: 24, y: 72 },
    { id: "X24Y76", x: 24, y: 76 },
    { id: "X24Y80", x: 24, y: 80 },
    { id: "X24Y84", x: 24, y: 84 },
    { id: "X24Y88", x: 24, y: 88 },
    { id: "X24Y92", x: 24, y: 92 },
    { id: "X24Y96", x: 24, y: 96 },
    { id: "X24Y100", x: 24, y: 100 },

    // --- Column X = 28 ---
    { id: "X28Y0", x: 28, y: 0 },
    { id: "X28Y4", x: 28, y: 4 },
    { id: "X28Y8", x: 28, y: 8 },
    { id: "X28Y12", x: 28, y: 12 },
    { id: "X28Y16", x: 28, y: 16 },
    { id: "X28Y20", x: 28, y: 20 },
    { id: "X28Y24", x: 28, y: 24 },
    { id: "X28Y28", x: 28, y: 28 },
    { id: "X28Y32", x: 28, y: 32 },
    { id: "X28Y36", x: 28, y: 36 },
    { id: "X28Y40", x: 28, y: 40 },
    { id: "X28Y44", x: 28, y: 44 },
    { id: "X28Y48", x: 28, y: 48 },
    { id: "X28Y52", x: 28, y: 52 },
    { id: "X28Y56", x: 28, y: 56 },
    { id: "X28Y60", x: 28, y: 60 },
    { id: "X28Y64", x: 28, y: 64 },
    { id: "X28Y68", x: 28, y: 68 },
    { id: "X28Y72", x: 28, y: 72 },
    { id: "X28Y76", x: 28, y: 76 },
    { id: "X28Y80", x: 28, y: 80 },
    { id: "X28Y84", x: 28, y: 84 },
    { id: "X28Y88", x: 28, y: 88 },
    { id: "X28Y92", x: 28, y: 92 },
    { id: "X28Y96", x: 28, y: 96 },
    { id: "X28Y100", x: 28, y: 100 },

    // --- Column X = 32 ---
    { id: "X32Y0", x: 32, y: 0 },
    { id: "X32Y4", x: 32, y: 4 },
    { id: "X32Y8", x: 32, y: 8 },
    { id: "X32Y12", x: 32, y: 12 },
    { id: "X32Y16", x: 32, y: 16 },
    { id: "X32Y20", x: 32, y: 20 },
    { id: "X32Y24", x: 32, y: 24 },
    { id: "X32Y28", x: 32, y: 28 },
    { id: "X32Y32", x: 32, y: 32 },
    { id: "X32Y36", x: 32, y: 36 },
    { id: "X32Y40", x: 32, y: 40 },
    { id: "X32Y44", x: 32, y: 44 },
    { id: "X32Y48", x: 32, y: 48 },
    { id: "X32Y52", x: 32, y: 52 },
    { id: "X32Y56", x: 32, y: 56 },
    { id: "X32Y60", x: 32, y: 60 },
    { id: "X32Y64", x: 32, y: 64 },
    { id: "X32Y68", x: 32, y: 68 },
    { id: "X32Y72", x: 32, y: 72 },
    { id: "X32Y76", x: 32, y: 76 },
    { id: "X32Y80", x: 32, y: 80 },
    { id: "X32Y84", x: 32, y: 84 },
    { id: "X32Y88", x: 32, y: 88 },
    { id: "X32Y92", x: 32, y: 92 },
    { id: "X32Y96", x: 32, y: 96 },
    { id: "X32Y100", x: 32, y: 100 },

    // --- Column X = 36 ---
    { id: "X36Y0", x: 36, y: 0 },
    { id: "X36Y4", x: 36, y: 4 },
    { id: "X36Y8", x: 36, y: 8 },
    { id: "X36Y12", x: 36, y: 12 },
    { id: "X36Y16", x: 36, y: 16 },
    { id: "X36Y20", x: 36, y: 20 },
    { id: "X36Y24", x: 36, y: 24 },
    { id: "X36Y28", x: 36, y: 28 },
    { id: "X36Y32", x: 36, y: 32 },
    { id: "X36Y36", x: 36, y: 36 },
    { id: "X36Y40", x: 36, y: 40 },
    { id: "X36Y44", x: 36, y: 44 },
    { id: "X36Y48", x: 36, y: 48 },
    { id: "X36Y52", x: 36, y: 52 },
    { id: "X36Y56", x: 36, y: 56 },
    { id: "X36Y60", x: 36, y: 60 },
    { id: "X36Y64", x: 36, y: 64 },
    { id: "X36Y68", x: 36, y: 68 },
    { id: "X36Y72", x: 36, y: 72 },
    { id: "X36Y76", x: 36, y: 76 },
    { id: "X36Y80", x: 36, y: 80 },
    { id: "X36Y84", x: 36, y: 84 },
    { id: "X36Y88", x: 36, y: 88 },
    { id: "X36Y92", x: 36, y: 92 },
    { id: "X36Y96", x: 36, y: 96 },
    { id: "X36Y100", x: 36, y: 100 },

    // --- Column X = 40 ---
    { id: "X40Y0", x: 40, y: 0 },
    { id: "X40Y4", x: 40, y: 4 },
    { id: "X40Y8", x: 40, y: 8 },
    { id: "X40Y12", x: 40, y: 12 },
    { id: "X40Y16", x: 40, y: 16 },
    { id: "X40Y20", x: 40, y: 20 },
    { id: "X40Y24", x: 40, y: 24 },
    { id: "X40Y28", x: 40, y: 28 },
    { id: "X40Y32", x: 40, y: 32 },
    { id: "X40Y36", x: 40, y: 36 },
    { id: "X40Y40", x: 40, y: 40 },
    { id: "X40Y44", x: 40, y: 44 },
    { id: "X40Y48", x: 40, y: 48 },
    { id: "X40Y52", x: 40, y: 52 },
    { id: "X40Y56", x: 40, y: 56 },
    { id: "X40Y60", x: 40, y: 60 },
    { id: "X40Y64", x: 40, y: 64 },
    { id: "X40Y68", x: 40, y: 68 },
    { id: "X40Y72", x: 40, y: 72 },
    { id: "X40Y76", x: 40, y: 76 },
    { id: "X40Y80", x: 40, y: 80 },
    { id: "X40Y84", x: 40, y: 84 },
    { id: "X40Y88", x: 40, y: 88 },
    { id: "X40Y92", x: 40, y: 92 },
    { id: "X40Y96", x: 40, y: 96 },
    { id: "X40Y100", x: 40, y: 100 },

    // --- Column X = 44 ---
    { id: "X44Y0", x: 44, y: 0 },
    { id: "X44Y4", x: 44, y: 4 },
    { id: "X44Y8", x: 44, y: 8 },
    { id: "X44Y12", x: 44, y: 12 },
    { id: "X44Y16", x: 44, y: 16 },
    { id: "X44Y20", x: 44, y: 20 },
    { id: "X44Y24", x: 44, y: 24 },
    { id: "X44Y28", x: 44, y: 28 },
    { id: "X44Y32", x: 44, y: 32 },
    { id: "X44Y36", x: 44, y: 36 },
    { id: "X44Y40", x: 44, y: 40 },
    { id: "X44Y44", x: 44, y: 44 },
    { id: "X44Y48", x: 44, y: 48 },
    { id: "X44Y52", x: 44, y: 52 },
    { id: "X44Y56", x: 44, y: 56 },
    { id: "X44Y60", x: 44, y: 60 },
    { id: "X44Y64", x: 44, y: 64 },
    { id: "X44Y68", x: 44, y: 68 },
    { id: "X44Y72", x: 44, y: 72 },
    { id: "X44Y76", x: 44, y: 76 },
    { id: "X44Y80", x: 44, y: 80 },
    { id: "X44Y84", x: 44, y: 84 },
    { id: "X44Y88", x: 44, y: 88 },
    { id: "X44Y92", x: 44, y: 92 },
    { id: "X44Y96", x: 44, y: 96 },
    { id: "X44Y100", x: 44, y: 100 },

    // --- Column X = 48 ---
    { id: "X48Y0", x: 48, y: 0 },
    { id: "X48Y4", x: 48, y: 4 },
    { id: "X48Y8", x: 48, y: 8 },
    { id: "X48Y12", x: 48, y: 12 },
    { id: "X48Y16", x: 48, y: 16 },
    { id: "X48Y20", x: 48, y: 20 },
    { id: "X48Y24", x: 48, y: 24 },
    { id: "X48Y28", x: 48, y: 28 },
    { id: "X48Y32", x: 48, y: 32 },
    { id: "X48Y36", x: 48, y: 36 },
    { id: "X48Y40", x: 48, y: 40 },
    { id: "X48Y44", x: 48, y: 44 },
    { id: "X48Y48", x: 48, y: 48 },
    { id: "X48Y52", x: 48, y: 52 },
    { id: "X48Y56", x: 48, y: 56 },
    { id: "X48Y60", x: 48, y: 60 },
    { id: "X48Y64", x: 48, y: 64 },
    { id: "X48Y68", x: 48, y: 68 },
    { id: "X48Y72", x: 48, y: 72 },
    { id: "X48Y76", x: 48, y: 76 },
    { id: "X48Y80", x: 48, y: 80 },
    { id: "X48Y84", x: 48, y: 84 },
    { id: "X48Y88", x: 48, y: 88 },
    { id: "X48Y92", x: 48, y: 92 },
    { id: "X48Y96", x: 48, y: 96 },
    { id: "X48Y100", x: 48, y: 100 },

    // --- Column X = 52 ---
    { id: "X52Y0", x: 52, y: 0 },
    { id: "X52Y4", x: 52, y: 4 },
    { id: "X52Y8", x: 52, y: 8 },
    { id: "X52Y12", x: 52, y: 12 },
    { id: "X52Y16", x: 52, y: 16 },
    { id: "X52Y20", x: 52, y: 20 },
    { id: "X52Y24", x: 52, y: 24 },
    { id: "X52Y28", x: 52, y: 28 },
    { id: "X52Y32", x: 52, y: 32 },
    { id: "X52Y36", x: 52, y: 36 },
    { id: "X52Y40", x: 52, y: 40 },
    { id: "X52Y44", x: 52, y: 44 },
    { id: "X52Y48", x: 52, y: 48 },
    { id: "X52Y52", x: 52, y: 52 },
    { id: "X52Y56", x: 52, y: 56 },
    { id: "X52Y60", x: 52, y: 60 },
    { id: "X52Y64", x: 52, y: 64 },
    { id: "X52Y68", x: 52, y: 68 },
    { id: "X52Y72", x: 52, y: 72 },
    { id: "X52Y76", x: 52, y: 76 },
    { id: "X52Y80", x: 52, y: 80 },
    { id: "X52Y84", x: 52, y: 84 },
    { id: "X52Y88", x: 52, y: 88 },
    { id: "X52Y92", x: 52, y: 92 },
    { id: "X52Y96", x: 52, y: 96 },
    { id: "X52Y100", x: 52, y: 100 },

    // --- Column X = 56 ---
    { id: "X56Y0", x: 56, y: 0 },
    { id: "X56Y4", x: 56, y: 4 },
    { id: "X56Y8", x: 56, y: 8 },
    { id: "X56Y12", x: 56, y: 12 },
    { id: "X56Y16", x: 56, y: 16 },
    { id: "X56Y20", x: 56, y: 20 },
    { id: "X56Y24", x: 56, y: 24 },
    { id: "X56Y28", x: 56, y: 28 },
    { id: "X56Y32", x: 56, y: 32 },
    { id: "X56Y36", x: 56, y: 36 },
    { id: "X56Y40", x: 56, y: 40 },
    { id: "X56Y44", x: 56, y: 44 },
    { id: "X56Y48", x: 56, y: 48 },
    { id: "X56Y52", x: 56, y: 52 },
    { id: "X56Y56", x: 56, y: 56 },
    { id: "X56Y60", x: 56, y: 60 },
    { id: "X56Y64", x: 56, y: 64 },
    { id: "X56Y68", x: 56, y: 68 },
    { id: "X56Y72", x: 56, y: 72 },
    { id: "X56Y76", x: 56, y: 76 },
    { id: "X56Y80", x: 56, y: 80 },
    { id: "X56Y84", x: 56, y: 84 },
    { id: "X56Y88", x: 56, y: 88 },
    { id: "X56Y92", x: 56, y: 92 },
    { id: "X56Y96", x: 56, y: 96 },
    { id: "X56Y100", x: 56, y: 100 },

    // --- Column X = 60 ---
    { id: "X60Y0", x: 60, y: 0 },
    { id: "X60Y4", x: 60, y: 4 },
    { id: "X60Y8", x: 60, y: 8 },
    { id: "X60Y12", x: 60, y: 12 },
    { id: "X60Y16", x: 60, y: 16 },
    { id: "X60Y20", x: 60, y: 20 },
    { id: "X60Y24", x: 60, y: 24 },
    { id: "X60Y28", x: 60, y: 28 },
    { id: "X60Y32", x: 60, y: 32 },
    { id: "X60Y36", x: 60, y: 36 },
    { id: "X60Y40", x: 60, y: 40 },
    { id: "X60Y44", x: 60, y: 44 },
    { id: "X60Y48", x: 60, y: 48 },
    { id: "X60Y52", x: 60, y: 52 },
    { id: "X60Y56", x: 60, y: 56 },
    { id: "X60Y60", x: 60, y: 60 },
    { id: "X60Y64", x: 60, y: 64 },
    { id: "X60Y68", x: 60, y: 68 },
    { id: "X60Y72", x: 60, y: 72 },
    { id: "X60Y76", x: 60, y: 76 },
    { id: "X60Y80", x: 60, y: 80 },
    { id: "X60Y84", x: 60, y: 84 },
    { id: "X60Y88", x: 60, y: 88 },
    { id: "X60Y92", x: 60, y: 92 },
    { id: "X60Y96", x: 60, y: 96 },
    { id: "X60Y100", x: 60, y: 100 },

    // --- Column X = 64 ---
    { id: "X64Y0", x: 64, y: 0 },
    { id: "X64Y4", x: 64, y: 4 },
    { id: "X64Y8", x: 64, y: 8 },
    { id: "X64Y12", x: 64, y: 12 },
    { id: "X64Y16", x: 64, y: 16 },
    { id: "X64Y20", x: 64, y: 20 },
    { id: "X64Y24", x: 64, y: 24 },
    { id: "X64Y28", x: 64, y: 28 },
    { id: "X64Y32", x: 64, y: 32 },
    { id: "X64Y36", x: 64, y: 36 },
    { id: "X64Y40", x: 64, y: 40 },
    { id: "X64Y44", x: 64, y: 44 },
    { id: "X64Y48", x: 64, y: 48 },
    { id: "X64Y52", x: 64, y: 52 },
    { id: "X64Y56", x: 64, y: 56 },
    { id: "X64Y60", x: 64, y: 60 },
    { id: "X64Y64", x: 64, y: 64 },
    { id: "X64Y68", x: 64, y: 68 },
    { id: "X64Y72", x: 64, y: 72 },
    { id: "X64Y76", x: 64, y: 76 },
    { id: "X64Y80", x: 64, y: 80 },
    { id: "X64Y84", x: 64, y: 84 },
    { id: "X64Y88", x: 64, y: 88 },
    { id: "X64Y92", x: 64, y: 92 },
    { id: "X64Y96", x: 64, y: 96 },
    { id: "X64Y100", x: 64, y: 100 },

    // --- Column X = 68 ---
    { id: "X68Y0", x: 68, y: 0 },
    { id: "X68Y4", x: 68, y: 4 },
    { id: "X68Y8", x: 68, y: 8 },
    { id: "X68Y12", x: 68, y: 12 },
    { id: "X68Y16", x: 68, y: 16 },
    { id: "X68Y20", x: 68, y: 20 },
    { id: "X68Y24", x: 68, y: 24 },
    { id: "X68Y28", x: 68, y: 28 },
    { id: "X68Y32", x: 68, y: 32 },
    { id: "X68Y36", x: 68, y: 36 },
    { id: "X68Y40", x: 68, y: 40 },
    { id: "X68Y44", x: 68, y: 44 },
    { id: "X68Y48", x: 68, y: 48 },
    { id: "X68Y52", x: 68, y: 52 },
    { id: "X68Y56", x: 68, y: 56 },
    { id: "X68Y60", x: 68, y: 60 },
    { id: "X68Y64", x: 68, y: 64 },
    { id: "X68Y68", x: 68, y: 68 },
    { id: "X68Y72", x: 68, y: 72 },
    { id: "X68Y76", x: 68, y: 76 },
    { id: "X68Y80", x: 68, y: 80 },
    { id: "X68Y84", x: 68, y: 84 },
    { id: "X68Y88", x: 68, y: 88 },
    { id: "X68Y92", x: 68, y: 92 },
    { id: "X68Y96", x: 68, y: 96 },
    { id: "X68Y100", x: 68, y: 100 },

    // --- Column X = 72 ---
    { id: "X72Y0", x: 72, y: 0 },
    { id: "X72Y4", x: 72, y: 4 },
    { id: "X72Y8", x: 72, y: 8 },
    { id: "X72Y12", x: 72, y: 12 },
    { id: "X72Y16", x: 72, y: 16 },
    { id: "X72Y20", x: 72, y: 20 },
    { id: "X72Y24", x: 72, y: 24 },
    { id: "X72Y28", x: 72, y: 28 },
    { id: "X72Y32", x: 72, y: 32 },
    { id: "X72Y36", x: 72, y: 36 },
    { id: "X72Y40", x: 72, y: 40 },
    { id: "X72Y44", x: 72, y: 44 },
    { id: "X72Y48", x: 72, y: 48 },
    { id: "X72Y52", x: 72, y: 52 },
    { id: "X72Y56", x: 72, y: 56 },
    { id: "X72Y60", x: 72, y: 60 },
    { id: "X72Y64", x: 72, y: 64 },
    { id: "X72Y68", x: 72, y: 68 },
    { id: "X72Y72", x: 72, y: 72 },
    { id: "X72Y76", x: 72, y: 76 },
    { id: "X72Y80", x: 72, y: 80 },
    { id: "X72Y84", x: 72, y: 84 },
    { id: "X72Y88", x: 72, y: 88 },
    { id: "X72Y92", x: 72, y: 92 },
    { id: "X72Y96", x: 72, y: 96 },
    { id: "X72Y100", x: 72, y: 100 },

    //  ---Column X = 74 ---
    { id: "X74Y30", x: 74, y: 30},
    { id: "X74734", x: 74, y: 34},

    // --- Column X = 76 ---
    { id: "X76Y0", x: 76, y: 0 },
    { id: "X76Y4", x: 76, y: 4 },
    { id: "X76Y8", x: 76, y: 8 },
    { id: "X76Y12", x: 76, y: 12 },
    { id: "X76Y16", x: 76, y: 16 },
    { id: "X76Y20", x: 76, y: 20 },
    { id: "X76Y24", x: 76, y: 24 },
    { id: "X76Y28", x: 76, y: 28 },
    { id: "X76Y32", x: 76, y: 32 },
    { id: "X76Y36", x: 76, y: 36 },
    { id: "X76Y40", x: 76, y: 40 },
    { id: "X76Y44", x: 76, y: 44 },
    { id: "X76Y48", x: 76, y: 48 },
    { id: "X76Y52", x: 76, y: 52 },
    { id: "X76Y56", x: 76, y: 56 },
    { id: "X76Y60", x: 76, y: 60 },
    { id: "X76Y64", x: 76, y: 64 },
    { id: "X76Y68", x: 76, y: 68 },
    { id: "X76Y72", x: 76, y: 72 },
    { id: "X76Y76", x: 76, y: 76 },
    { id: "X76Y80", x: 76, y: 80 },
    { id: "X76Y84", x: 76, y: 84 },
    { id: "X76Y88", x: 76, y: 88 },
    { id: "X76Y92", x: 76, y: 92 },
    { id: "X76Y96", x: 76, y: 96 },
    { id: "X76Y100", x: 76, y: 100 },

    // --- Column X = 80 ---
    { id: "X80Y0", x: 80, y: 0 },
    { id: "X80Y4", x: 80, y: 4 },
    { id: "X80Y8", x: 80, y: 8 },
    { id: "X80Y12", x: 80, y: 12 },
    { id: "X80Y16", x: 80, y: 16 },
    { id: "X80Y20", x: 80, y: 20 },
    { id: "X80Y24", x: 80, y: 24 },
    { id: "X80Y28", x: 80, y: 28 },
    { id: "X80Y32", x: 80, y: 32 },
    { id: "X80Y36", x: 80, y: 36 },
    { id: "X80Y40", x: 80, y: 40 },
    { id: "X80Y44", x: 80, y: 44 },
    { id: "X80Y48", x: 80, y: 48 },
    { id: "X80Y52", x: 80, y: 52 },
    { id: "X80Y56", x: 80, y: 56 },
    { id: "X80Y60", x: 80, y: 60 },
    { id: "X80Y64", x: 80, y: 64 },
    { id: "X80Y68", x: 80, y: 68 },
    { id: "X80Y72", x: 80, y: 72 },
    { id: "X80Y76", x: 80, y: 76 },
    { id: "X80Y80", x: 80, y: 80 },
    { id: "X80Y84", x: 80, y: 84 },
    { id: "X80Y88", x: 80, y: 88 },
    { id: "X80Y92", x: 80, y: 92 },
    { id: "X80Y96", x: 80, y: 96 },
    { id: "X80Y100", x: 80, y: 100 },

    // --- Column X = 84 ---
    { id: "X84Y0", x: 84, y: 0 },
    { id: "X84Y4", x: 84, y: 4 },
    { id: "X84Y8", x: 84, y: 8 },
    { id: "X84Y12", x: 84, y: 12 },
    { id: "X84Y16", x: 84, y: 16 },
    { id: "X84Y20", x: 84, y: 20 },
    { id: "X84Y24", x: 84, y: 24 },
    { id: "X84Y28", x: 84, y: 28 },
    { id: "X84Y32", x: 84, y: 32 },
    { id: "X84Y36", x: 84, y: 36 },
    { id: "X84Y40", x: 84, y: 40 },
    { id: "X84Y44", x: 84, y: 44 },
    { id: "X84Y48", x: 84, y: 48 },
    { id: "X84Y52", x: 84, y: 52 },
    { id: "X84Y56", x: 84, y: 56 },
    { id: "X84Y60", x: 84, y: 60 },
    { id: "X84Y64", x: 84, y: 64 },
    { id: "X84Y68", x: 84, y: 68 },
    { id: "X84Y72", x: 84, y: 72 },
    { id: "X84Y76", x: 84, y: 76 },
    { id: "X84Y80", x: 84, y: 80 },
    { id: "X84Y84", x: 84, y: 84 },
    { id: "X84Y88", x: 84, y: 88 },
    { id: "X84Y92", x: 84, y: 92 },
    { id: "X84Y96", x: 84, y: 96 },
    { id: "X84Y100", x: 84, y: 100 },

    // --- Column X = 88 ---
    { id: "X88Y0", x: 88, y: 0 },
    { id: "X88Y4", x: 88, y: 4 },
    { id: "X88Y8", x: 88, y: 8 },
    { id: "X88Y12", x: 88, y: 12 },
    { id: "X88Y16", x: 88, y: 16 },
    { id: "X88Y20", x: 88, y: 20 },
    { id: "X88Y24", x: 88, y: 24 },
    { id: "X88Y28", x: 88, y: 28 },
    { id: "X88Y32", x: 88, y: 32 },
    { id: "X88Y36", x: 88, y: 36 },
    { id: "X88Y40", x: 88, y: 40 },
    { id: "X88Y44", x: 88, y: 44 },
    { id: "X88Y48", x: 88, y: 48 },
    { id: "X88Y52", x: 88, y: 52 },
    { id: "X88Y56", x: 88, y: 56 },
    { id: "X88Y60", x: 88, y: 60 },
    { id: "X88Y64", x: 88, y: 64 },
    { id: "X88Y68", x: 88, y: 68 },
    { id: "X88Y72", x: 88, y: 72 },
    { id: "X88Y76", x: 88, y: 76 },
    { id: "X88Y80", x: 88, y: 80 },
    { id: "X88Y84", x: 88, y: 84 },
    { id: "X88Y88", x: 88, y: 88 },
    { id: "X88Y92", x: 88, y: 92 },
    { id: "X88Y96", x: 88, y: 96 },
    { id: "X88Y100", x: 88, y: 100 },

    // --- Column X = 92 ---
    { id: "X92Y0", x: 92, y: 0 },
    { id: "X92Y4", x: 92, y: 4 },
    { id: "X92Y8", x: 92, y: 8 },
    { id: "X92Y12", x: 92, y: 12 },
    { id: "X92Y16", x: 92, y: 16 },
    { id: "X92Y20", x: 92, y: 20 },
    { id: "X92Y24", x: 92, y: 24 },
    { id: "X92Y28", x: 92, y: 28 },
    { id: "X92Y32", x: 92, y: 32 },
    { id: "X92Y36", x: 92, y: 36 },
    { id: "X92Y40", x: 92, y: 40 },
    { id: "X92Y44", x: 92, y: 44 },
    { id: "X92Y48", x: 92, y: 48 },
    { id: "X92Y52", x: 92, y: 52 },
    { id: "X92Y56", x: 92, y: 56 },
    { id: "X92Y60", x: 92, y: 60 },
    { id: "X92Y64", x: 92, y: 64 },
    { id: "X92Y68", x: 92, y: 68 },
    { id: "X92Y72", x: 92, y: 72 },
    { id: "X92Y76", x: 92, y: 76 },
    { id: "X92Y80", x: 92, y: 80 },
    { id: "X92Y84", x: 92, y: 84 },
    { id: "X92Y88", x: 92, y: 88 },
    { id: "X92Y92", x: 92, y: 92 },
    { id: "X92Y96", x: 92, y: 96 },
    { id: "X92Y100", x: 92, y: 100 },

    // --- Column X = 96 ---
    { id: "X96Y0", x: 96, y: 0 },
    { id: "X96Y4", x: 96, y: 4 },
    { id: "X96Y8", x: 96, y: 8 },
    { id: "X96Y12", x: 96, y: 12 },
    { id: "X96Y16", x: 96, y: 16 },
    { id: "X96Y20", x: 96, y: 20 },
    { id: "X96Y24", x: 96, y: 24 },
    { id: "X96Y28", x: 96, y: 28 },
    { id: "X96Y32", x: 96, y: 32 },
    { id: "X96Y36", x: 96, y: 36 },
    { id: "X96Y40", x: 96, y: 40 },
    { id: "X96Y44", x: 96, y: 44 },
    { id: "X96Y48", x: 96, y: 48 },
    { id: "X96Y52", x: 96, y: 52 },
    { id: "X96Y56", x: 96, y: 56 },
    { id: "X96Y60", x: 96, y: 60 },
    { id: "X96Y64", x: 96, y: 64 },
    { id: "X96Y68", x: 96, y: 68 },
    { id: "X96Y72", x: 96, y: 72 },
    { id: "X96Y76", x: 96, y: 76 },
    { id: "X96Y80", x: 96, y: 80 },
    { id: "X96Y84", x: 96, y: 84 },
    { id: "X96Y88", x: 96, y: 88 },
    { id: "X96Y92", x: 96, y: 92 },
    { id: "X96Y96", x: 96, y: 96 },
    { id: "X96Y100", x: 96, y: 100 },

    // --- Column X = 100 ---
    { id: "X100Y0", x: 100, y: 0 },
    { id: "X100Y4", x: 100, y: 4 },
    { id: "X100Y8", x: 100, y: 8 },
    { id: "X100Y12", x: 100, y: 12 },
    { id: "X100Y16", x: 100, y: 16 },
    { id: "X100Y20", x: 100, y: 20 },
    { id: "X100Y24", x: 100, y: 24 },
    // RE1 is at Y26 (irregular)
    { id: "X100Y28", x: 100, y: 28 },
    { id: "X100Y32", x: 100, y: 32 },
    { id: "X100Y36", x: 100, y: 36 },
    { id: "X100Y40", x: 100, y: 40 },
    { id: "X100Y44", x: 100, y: 44 },
    { id: "X100Y48", x: 100, y: 48 },
    // RE2 is at Y50 (irregular)
    { id: "X100Y52", x: 100, y: 52 },
    { id: "X100Y56", x: 100, y: 56 },
    { id: "X100Y60", x: 100, y: 60 },
    { id: "X100Y64", x: 100, y: 64 },
    { id: "X100Y68", x: 100, y: 68 },
    { id: "X100Y72", x: 100, y: 72 },
    // RE3 is at Y74 (irregular)
    { id: "X100Y76", x: 100, y: 76 },
    { id: "X100Y80", x: 100, y: 80 },
    { id: "X100Y84", x: 100, y: 84 },
    { id: "X100Y88", x: 100, y: 88 },
    { id: "X100Y92", x: 100, y: 92 },
    { id: "X100Y96", x: 100, y: 96 },
    { id: "X100Y100", x: 100, y: 100 },
];

const EDGES: Edge[] = [
    // ==========================================
    // 1. SPECIAL CONNECTIONS (Entries / Exits)
    // ==========================================
    
    // Destination
    { from: "DEST", to: "X4Y52" },

    // Top Entries (Connect to the grid row Y=0 or Y=4)
    { from: "T1", to: "X36Y8" }, // Adjusted to nearest grid point
    { from: "T2", to: "X64Y8" },
    // { from: "T3", to: "X92Y8" },

    // Right Entries
    // { from: "RE1", to: "X80Y28" }, // Nearest grid Y28
    { from: "RE2", to: "X80Y52" }, // Nearest grid Y52
    { from: "RE3", to: "X88Y76" }, // Nearest grid Y76

    // Bottom Entries
    { from: "B1", to: "X52Y84" },
    { from: "B2", to: "X80Y76" },

    // ==========================================
    // 2. HORIZONTAL EDGES (Left <-> Right)
    // ==========================================

    // --- Row Y = 0 ---
    { from: "X0Y0", to: "X4Y0" }, { from: "X4Y0", to: "X8Y0" }, { from: "X8Y0", to: "X12Y0" },
    { from: "X12Y0", to: "X16Y0" }, { from: "X16Y0", to: "X20Y0" }, { from: "X20Y0", to: "X24Y0" },
    { from: "X24Y0", to: "X28Y0" }, { from: "X28Y0", to: "X32Y0" }, { from: "X32Y0", to: "X36Y0" },
    { from: "X36Y0", to: "X40Y0" }, { from: "X40Y0", to: "X44Y0" }, { from: "X44Y0", to: "X48Y0" },
    { from: "X48Y0", to: "X52Y0" }, { from: "X52Y0", to: "X56Y0" }, { from: "X56Y0", to: "X60Y0" },
    { from: "X60Y0", to: "X64Y0" }, { from: "X64Y0", to: "X68Y0" }, { from: "X68Y0", to: "X72Y0" },
    { from: "X72Y0", to: "X76Y0" }, { from: "X76Y0", to: "X80Y0" }, { from: "X80Y0", to: "X84Y0" },
    { from: "X84Y0", to: "X88Y0" }, { from: "X88Y0", to: "X92Y0" }, { from: "X92Y0", to: "X96Y0" },
    { from: "X96Y0", to: "X100Y0" },

    // --- Row Y = 4 ---
    { from: "X0Y4", to: "X4Y4" }, { from: "X4Y4", to: "X8Y4" }, { from: "X8Y4", to: "X12Y4" },
    { from: "X12Y4", to: "X16Y4" }, { from: "X16Y4", to: "X20Y4" }, { from: "X20Y4", to: "X24Y4" },
    { from: "X24Y4", to: "X28Y4" }, { from: "X28Y4", to: "X32Y4" }, { from: "X32Y4", to: "X36Y4" },
    { from: "X36Y4", to: "X40Y4" }, { from: "X40Y4", to: "X44Y4" }, { from: "X44Y4", to: "X48Y4" },
    { from: "X48Y4", to: "X52Y4" }, { from: "X52Y4", to: "X56Y4" }, { from: "X56Y4", to: "X60Y4" },
    { from: "X60Y4", to: "X64Y4" }, { from: "X64Y4", to: "X68Y4" }, { from: "X68Y4", to: "X72Y4" },
    { from: "X72Y4", to: "X76Y4" }, { from: "X76Y4", to: "X80Y4" }, { from: "X80Y4", to: "X84Y4" },
    { from: "X84Y4", to: "X88Y4" }, { from: "X88Y4", to: "X92Y4" }, { from: "X92Y4", to: "X96Y4" },
    { from: "X96Y4", to: "X100Y4" },

    // --- Row Y = 8 ---
    { from: "X0Y8", to: "X4Y8" }, { from: "X4Y8", to: "X8Y8" }, { from: "X8Y8", to: "X12Y8" },
    { from: "X12Y8", to: "X16Y8" }, { from: "X16Y8", to: "X20Y8" }, { from: "X20Y8", to: "X24Y8" },
    { from: "X24Y8", to: "X28Y8" }, { from: "X28Y8", to: "X32Y8" }, { from: "X32Y8", to: "X36Y8" },
    { from: "X36Y8", to: "X40Y8" }, { from: "X40Y8", to: "X44Y8" }, { from: "X44Y8", to: "X48Y8" },
    { from: "X48Y8", to: "X52Y8" }, { from: "X52Y8", to: "X56Y8" }, { from: "X56Y8", to: "X60Y8" },
    { from: "X60Y8", to: "X64Y8" }, { from: "X64Y8", to: "X68Y8" }, { from: "X68Y8", to: "X72Y8" },
    { from: "X72Y8", to: "X76Y8" }, { from: "X76Y8", to: "X80Y8" }, { from: "X80Y8", to: "X84Y8" },
    { from: "X84Y8", to: "X88Y8" }, { from: "X88Y8", to: "X92Y8" }, { from: "X92Y8", to: "X96Y8" },
    { from: "X96Y8", to: "X100Y8" },

    // --- Row Y = 12 ---
    { from: "X0Y12", to: "X4Y12" }, { from: "X4Y12", to: "X8Y12" }, { from: "X8Y12", to: "X12Y12" },
    { from: "X12Y12", to: "X16Y12" }, { from: "X16Y12", to: "X20Y12" }, { from: "X20Y12", to: "X24Y12" },
    { from: "X24Y12", to: "X28Y12" }, { from: "X28Y12", to: "X32Y12" }, { from: "X32Y12", to: "X36Y12" },
    { from: "X36Y12", to: "X40Y12" }, { from: "X40Y12", to: "X44Y12" }, { from: "X44Y12", to: "X48Y12" },
    { from: "X48Y12", to: "X52Y12" }, { from: "X52Y12", to: "X56Y12" }, { from: "X56Y12", to: "X60Y12" },
    { from: "X60Y12", to: "X64Y12" }, { from: "X64Y12", to: "X68Y12" }, { from: "X68Y12", to: "X72Y12" },
    { from: "X72Y12", to: "X76Y12" }, { from: "X76Y12", to: "X80Y12" }, { from: "X80Y12", to: "X84Y12" },
    { from: "X84Y12", to: "X88Y12" }, { from: "X88Y12", to: "X92Y12" }, { from: "X92Y12", to: "X96Y12" },
    { from: "X96Y12", to: "X100Y12" },

    // --- Row Y = 16 ---
    { from: "X0Y16", to: "X4Y16" }, { from: "X4Y16", to: "X8Y16" }, { from: "X8Y16", to: "X12Y16" },
    { from: "X12Y16", to: "X16Y16" }, { from: "X16Y16", to: "X20Y16" }, { from: "X20Y16", to: "X24Y16" },
    { from: "X24Y16", to: "X28Y16" }, 
    // { from: "X28Y16", to: "X32Y16" }, { from: "X32Y16", to: "X36Y16" },
    // { from: "X36Y16", to: "X40Y16" },
     { from: "X40Y16", to: "X44Y16" }, { from: "X44Y16", to: "X48Y16" },
    { from: "X48Y16", to: "X52Y16" }, { from: "X52Y16", to: "X56Y16" }, { from: "X56Y16", to: "X60Y16" },
    { from: "X60Y16", to: "X64Y16" }, { from: "X64Y16", to: "X68Y16" }, { from: "X68Y16", to: "X72Y16" },
    { from: "X72Y16", to: "X76Y16" }, { from: "X76Y16", to: "X80Y16" }, { from: "X80Y16", to: "X84Y16" },
    { from: "X84Y16", to: "X88Y16" }, { from: "X88Y16", to: "X92Y16" }, { from: "X92Y16", to: "X96Y16" },
    { from: "X96Y16", to: "X100Y16" },

    // --- Row Y = 20 ---
    { from: "X0Y20", to: "X4Y20" }, { from: "X4Y20", to: "X8Y20" }, { from: "X8Y20", to: "X12Y20" },
    { from: "X12Y20", to: "X16Y20" }, { from: "X16Y20", to: "X20Y20" }, { from: "X20Y20", to: "X24Y20" },
    // { from: "X24Y20", to: "X28Y20" },
    // { from: "X28Y20", to: "X32Y20" }, 
    // { from: "X32Y20", to: "X36Y20" },
    // { from: "X36Y20", to: "X40Y20" }, 
    // { from: "X40Y20", to: "X44Y20" }, 
    // { from: "X44Y20", to: "X48Y20" },
    { from: "X48Y20", to: "X52Y20" }, { from: "X52Y20", to: "X56Y20" }, { from: "X56Y20", to: "X60Y20" },
    { from: "X60Y20", to: "X64Y20" }, { from: "X64Y20", to: "X68Y20" }, { from: "X68Y20", to: "X72Y20" },
    { from: "X72Y20", to: "X76Y20" }, { from: "X76Y20", to: "X80Y20" }, { from: "X80Y20", to: "X84Y20" },
    { from: "X84Y20", to: "X88Y20" }, { from: "X88Y20", to: "X92Y20" }, { from: "X92Y20", to: "X96Y20" },
    { from: "X96Y20", to: "X100Y20" },

    // --- Row Y = 24 ---
    { from: "X0Y24", to: "X4Y24" }, { from: "X4Y24", to: "X8Y24" }, { from: "X8Y24", to: "X12Y24" },
    { from: "X12Y24", to: "X16Y24" }, { from: "X16Y24", to: "X20Y24" }, { from: "X20Y24", to: "X24Y24" },
    // { from: "X24Y24", to: "X28Y24" }, 
    // { from: "X28Y24", to: "X32Y24" }, 
    // { from: "X32Y24", to: "X36Y24" },
    // { from: "X36Y24", to: "X40Y24" }, 
    // { from: "X40Y24", to: "X44Y24" }, 
    { from: "X44Y24", to: "X48Y24" },
    { from: "X48Y24", to: "X52Y24" }, { from: "X52Y24", to: "X56Y24" }, { from: "X56Y24", to: "X60Y24" },
    { from: "X60Y24", to: "X64Y24" }, { from: "X64Y24", to: "X68Y24" }, { from: "X68Y24", to: "X72Y24" },
    { from: "X72Y24", to: "X76Y24" }, { from: "X76Y24", to: "X80Y24" }, { from: "X80Y24", to: "X84Y24" },
    { from: "X84Y24", to: "X88Y24" }, { from: "X88Y24", to: "X92Y24" }, { from: "X92Y24", to: "X96Y24" },
    { from: "X96Y24", to: "X100Y24" },

    // --- Row Y = 28 ---
    { from: "X0Y28", to: "X4Y28" }, { from: "X4Y28", to: "X8Y28" }, { from: "X8Y28", to: "X12Y28" },
    { from: "X12Y28", to: "X16Y28" }, { from: "X16Y28", to: "X20Y28" }, 
    // { from: "X20Y28", to: "X24Y28" },
    // { from: "X24Y28", to: "X28Y28" }, 
    // { from: "X28Y28", to: "X32Y28" }, 
    // { from: "X32Y28", to: "X36Y28" },
    // { from: "X36Y28", to: "X40Y28" }, 
    { from: "X40Y28", to: "X44Y28" }, 
    { from: "X44Y28", to: "X48Y28" },
    { from: "X48Y28", to: "X52Y28" }, { from: "X52Y28", to: "X56Y28" }, { from: "X56Y28", to: "X60Y28" },
    { from: "X60Y28", to: "X64Y28" }, { from: "X64Y28", to: "X68Y28" }, { from: "X68Y28", to: "X72Y28" },
    { from: "X72Y28", to: "X76Y28" }, { from: "X76Y28", to: "X80Y28" }, { from: "X80Y28", to: "X84Y28" },
    { from: "X84Y28", to: "X88Y28" }, { from: "X88Y28", to: "X92Y28" }, { from: "X92Y28", to: "X96Y28" },
    { from: "X96Y28", to: "X100Y28" },

    // --- Row Y = 32 ---
    { from: "X0Y32", to: "X4Y32" }, { from: "X4Y32", to: "X8Y32" }, { from: "X8Y32", to: "X12Y32" },
    { from: "X12Y32", to: "X16Y32" }, { from: "X16Y32", to: "X20Y32" }, { from: "X20Y32", to: "X24Y32" },
    // { from: "X24Y32", to: "X28Y32" }, { from: "X28Y32", to: "X32Y32" }, { from: "X32Y32", to: "X36Y32" },
    // { from: "X36Y32", to: "X40Y32" }, 
    { from: "X40Y32", to: "X44Y32" }, { from: "X44Y32", to: "X48Y32" },
    { from: "X48Y32", to: "X52Y32" }, { from: "X52Y32", to: "X56Y32" }, { from: "X56Y32", to: "X60Y32" },
    { from: "X60Y32", to: "X64Y32" }, { from: "X64Y32", to: "X68Y32" }, { from: "X68Y32", to: "X72Y32" },
    { from: "X72Y32", to: "X76Y32" }, { from: "X76Y32", to: "X80Y32" }, { from: "X80Y32", to: "X84Y32" },
    { from: "X84Y32", to: "X88Y32" }, { from: "X88Y32", to: "X92Y32" }, { from: "X92Y32", to: "X96Y32" },
    { from: "X96Y32", to: "X100Y32" },

    // --- Row Y = 36 ---
    { from: "X0Y36", to: "X4Y36" }, { from: "X4Y36", to: "X8Y36" }, { from: "X8Y36", to: "X12Y36" },
    { from: "X12Y36", to: "X16Y36" }, 
    { from: "X16Y36", to: "X20Y36" }, 
    // { from: "X20Y36", to: "X24Y36" },
    // { from: "X24Y36", to: "X28Y36" }, { from: "X28Y36", to: "X32Y36" }, { from: "X32Y36", to: "X36Y36" },
    // { from: "X36Y36", to: "X40Y36" }, { from: "X40Y36", to: "X44Y36" }, 
    { from: "X44Y36", to: "X48Y36" },
    { from: "X48Y36", to: "X52Y36" }, { from: "X52Y36", to: "X56Y36" }, { from: "X56Y36", to: "X60Y36" },
    { from: "X60Y36", to: "X64Y36" }, { from: "X64Y36", to: "X68Y36" }, { from: "X68Y36", to: "X72Y36" },
    { from: "X72Y36", to: "X76Y36" }, { from: "X76Y36", to: "X80Y36" }, { from: "X80Y36", to: "X84Y36" },
    { from: "X84Y36", to: "X88Y36" }, { from: "X88Y36", to: "X92Y36" }, { from: "X92Y36", to: "X96Y36" },
    { from: "X96Y36", to: "X100Y36" },

    // --- Row Y = 40 ---
    { from: "X0Y40", to: "X4Y40" }, { from: "X4Y40", to: "X8Y40" }, { from: "X8Y40", to: "X12Y40" },
    { from: "X12Y40", to: "X16Y40" }, 
    // { from: "X16Y40", to: "X20Y40" }, 
    // { from: "X20Y40", to: "X24Y40" },
    // { from: "X24Y40", to: "X28Y40" }, { from: "X28Y40", to: "X32Y40" }, { from: "X32Y40", to: "X36Y40" },
    // { from: "X36Y40", to: "X40Y40" }, { from: "X40Y40", to: "X44Y40" }, { from: "X44Y40", to: "X48Y40" },
    { from: "X48Y40", to: "X52Y40" }, { from: "X52Y40", to: "X56Y40" }, { from: "X56Y40", to: "X60Y40" },
    { from: "X60Y40", to: "X64Y40" }, { from: "X64Y40", to: "X68Y40" }, { from: "X68Y40", to: "X72Y40" },
    { from: "X72Y40", to: "X76Y40" }, { from: "X76Y40", to: "X80Y40" }, { from: "X80Y40", to: "X84Y40" },
    { from: "X84Y40", to: "X88Y40" }, { from: "X88Y40", to: "X92Y40" }, { from: "X92Y40", to: "X96Y40" },
    { from: "X96Y40", to: "X100Y40" },

    // --- Row Y = 44 ---
    { from: "X0Y44", to: "X4Y44" }, { from: "X4Y44", to: "X8Y44" }, { from: "X8Y44", to: "X12Y44" },
    { from: "X12Y44", to: "X16Y44" }, 
    // { from: "X16Y44", to: "X20Y44" }, { from: "X20Y44", to: "X24Y44" },
    // { from: "X24Y44", to: "X28Y44" }, { from: "X28Y44", to: "X32Y44" }, { from: "X32Y44", to: "X36Y44" },
    // { from: "X36Y44", to: "X40Y44" }, { from: "X40Y44", to: "X44Y44" }, 
    { from: "X44Y44", to: "X48Y44" },
    { from: "X48Y44", to: "X52Y44" }, { from: "X52Y44", to: "X56Y44" }, { from: "X56Y44", to: "X60Y44" },
    { from: "X60Y44", to: "X64Y44" }, { from: "X64Y44", to: "X68Y44" }, { from: "X68Y44", to: "X72Y44" },
    { from: "X72Y44", to: "X76Y44" }, { from: "X76Y44", to: "X80Y44" }, { from: "X80Y44", to: "X84Y44" },
    { from: "X84Y44", to: "X88Y44" }, { from: "X88Y44", to: "X92Y44" }, { from: "X92Y44", to: "X96Y44" },
    { from: "X96Y44", to: "X100Y44" },

    // --- Row Y = 48 ---
    { from: "X0Y48", to: "X4Y48" }, { from: "X4Y48", to: "X8Y48" }, { from: "X8Y48", to: "X12Y48" },
    { from: "X12Y48", to: "X16Y48" }, 
    // { from: "X16Y48", to: "X20Y48" }, 
    //{ from: "X20Y48", to: "X24Y48" },
    // { from: "X24Y48", to: "X28Y48" }, { from: "X28Y48", to: "X32Y48" }, { from: "X32Y48", to: "X36Y48" },
    // { from: "X36Y48", to: "X40Y48" }, { from: "X40Y48", to: "X44Y48" }, 
    { from: "X44Y48", to: "X48Y48" },
    { from: "X48Y48", to: "X52Y48" }, { from: "X52Y48", to: "X56Y48" }, { from: "X56Y48", to: "X60Y48" },
    { from: "X60Y48", to: "X64Y48" }, { from: "X64Y48", to: "X68Y48" }, { from: "X68Y48", to: "X72Y48" },
    { from: "X72Y48", to: "X76Y48" }, { from: "X76Y48", to: "X80Y48" }, { from: "X80Y48", to: "X84Y48" },
    { from: "X84Y48", to: "X88Y48" }, { from: "X88Y48", to: "X92Y48" }, { from: "X92Y48", to: "X96Y48" },
    { from: "X96Y48", to: "X100Y48" },

    // --- Row Y = 52 ---
    { from: "X0Y52", to: "X4Y52" }, { from: "X4Y52", to: "X8Y52" }, { from: "X8Y52", to: "X12Y52" },
    { from: "X12Y52", to: "X16Y52" }, { from: "X16Y52", to: "X20Y52" }, 
    // { from: "X20Y52", to: "X24Y52" },
    // { from: "X24Y52", to: "X28Y52" }, { from: "X28Y52", to: "X32Y52" }, { from: "X32Y52", to: "X36Y52" },
    // { from: "X36Y52", to: "X40Y52" }, { from: "X40Y52", to: "X44Y52" },
    { from: "X44Y52", to: "X48Y52" },
    { from: "X48Y52", to: "X52Y52" }, { from: "X52Y52", to: "X56Y52" }, { from: "X56Y52", to: "X60Y52" },
    { from: "X60Y52", to: "X64Y52" }, { from: "X64Y52", to: "X68Y52" }, { from: "X68Y52", to: "X72Y52" },
    { from: "X72Y52", to: "X76Y52" }, { from: "X76Y52", to: "X80Y52" }, { from: "X80Y52", to: "X84Y52" },
    { from: "X84Y52", to: "X88Y52" }, { from: "X88Y52", to: "X92Y52" }, { from: "X92Y52", to: "X96Y52" },
    { from: "X96Y52", to: "X100Y52" },

    // --- Row Y = 56 ---
    { from: "X0Y56", to: "X4Y56" }, { from: "X4Y56", to: "X8Y56" }, { from: "X8Y56", to: "X12Y56" },
    { from: "X12Y56", to: "X16Y56" }, { from: "X16Y56", to: "X20Y56" },
    //  { from: "X20Y56", to: "X24Y56" },
    // { from: "X24Y56", to: "X28Y56" }, { from: "X28Y56", to: "X32Y56" }, { from: "X32Y56", to: "X36Y56" },
    // { from: "X36Y56", to: "X40Y56" }, { from: "X40Y56", to: "X44Y56" }, { from: "X44Y56", to: "X48Y56" },
    { from: "X48Y56", to: "X52Y56" }, { from: "X52Y56", to: "X56Y56" }, { from: "X56Y56", to: "X60Y56" },
    { from: "X60Y56", to: "X64Y56" }, { from: "X64Y56", to: "X68Y56" }, { from: "X68Y56", to: "X72Y56" },
    { from: "X72Y56", to: "X76Y56" }, { from: "X76Y56", to: "X80Y56" }, { from: "X80Y56", to: "X84Y56" },
    { from: "X84Y56", to: "X88Y56" }, { from: "X88Y56", to: "X92Y56" }, { from: "X92Y56", to: "X96Y56" },
    { from: "X96Y56", to: "X100Y56" },

    // --- Row Y = 60 ---
    { from: "X0Y60", to: "X4Y60" }, { from: "X4Y60", to: "X8Y60" }, { from: "X8Y60", to: "X12Y60" },
    { from: "X12Y60", to: "X16Y60" }, { from: "X16Y60", to: "X20Y60" }, { from: "X20Y60", to: "X24Y60" },
    // { from: "X24Y60", to: "X28Y60" }, { from: "X28Y60", to: "X32Y60" }, { from: "X32Y60", to: "X36Y60" },
    // { from: "X36Y60", to: "X40Y60" }, { from: "X40Y60", to: "X44Y60" }, 
    { from: "X44Y60", to: "X48Y60" },
    { from: "X48Y60", to: "X52Y60" }, { from: "X52Y60", to: "X56Y60" }, { from: "X56Y60", to: "X60Y60" },
    { from: "X60Y60", to: "X64Y60" }, { from: "X64Y60", to: "X68Y60" }, { from: "X68Y60", to: "X72Y60" },
    { from: "X72Y60", to: "X76Y60" }, { from: "X76Y60", to: "X80Y60" }, { from: "X80Y60", to: "X84Y60" },
    { from: "X84Y60", to: "X88Y60" }, { from: "X88Y60", to: "X92Y60" }, { from: "X92Y60", to: "X96Y60" },
    { from: "X96Y60", to: "X100Y60" },

    // --- Row Y = 64 ---
    { from: "X0Y64", to: "X4Y64" }, { from: "X4Y64", to: "X8Y64" }, { from: "X8Y64", to: "X12Y64" },
    { from: "X12Y64", to: "X16Y64" }, { from: "X16Y64", to: "X20Y64" }, { from: "X20Y64", to: "X24Y64" },
    { from: "X24Y64", to: "X28Y64" }, 
    //{ from: "X28Y64", to: "X32Y64" }, { from: "X32Y64", to: "X36Y64" },
    // { from: "X36Y64", to: "X40Y64" }, { from: "X40Y64", to: "X44Y64" }, 
    { from: "X44Y64", to: "X48Y64" },
    { from: "X48Y64", to: "X52Y64" }, { from: "X52Y64", to: "X56Y64" }, { from: "X56Y64", to: "X60Y64" },
    { from: "X60Y64", to: "X64Y64" }, { from: "X64Y64", to: "X68Y64" }, { from: "X68Y64", to: "X72Y64" },
    { from: "X72Y64", to: "X76Y64" }, { from: "X76Y64", to: "X80Y64" }, { from: "X80Y64", to: "X84Y64" },
    { from: "X84Y64", to: "X88Y64" }, { from: "X88Y64", to: "X92Y64" }, { from: "X92Y64", to: "X96Y64" },
    { from: "X96Y64", to: "X100Y64" },

    // --- Row Y = 68 ---
    { from: "X0Y68", to: "X4Y68" }, { from: "X4Y68", to: "X8Y68" }, { from: "X8Y68", to: "X12Y68" },
    { from: "X12Y68", to: "X16Y68" }, { from: "X16Y68", to: "X20Y68" }, { from: "X20Y68", to: "X24Y68" },
    { from: "X24Y68", to: "X28Y68" }, { from: "X28Y68", to: "X32Y68" }, 
    // { from: "X32Y68", to: "X36Y68" },
    // { from: "X36Y68", to: "X40Y68" }, 
    { from: "X40Y68", to: "X44Y68" }, { from: "X44Y68", to: "X48Y68" },
    { from: "X48Y68", to: "X52Y68" }, { from: "X52Y68", to: "X56Y68" }, { from: "X56Y68", to: "X60Y68" },
    { from: "X60Y68", to: "X64Y68" }, { from: "X64Y68", to: "X68Y68" }, { from: "X68Y68", to: "X72Y68" },
    { from: "X72Y68", to: "X76Y68" }, { from: "X76Y68", to: "X80Y68" }, { from: "X80Y68", to: "X84Y68" },
    { from: "X84Y68", to: "X88Y68" }, { from: "X88Y68", to: "X92Y68" }, { from: "X92Y68", to: "X96Y68" },
    { from: "X96Y68", to: "X100Y68" },

    // --- Row Y = 72 ---
    { from: "X0Y72", to: "X4Y72" }, { from: "X4Y72", to: "X8Y72" }, { from: "X8Y72", to: "X12Y72" },
    { from: "X12Y72", to: "X16Y72" }, { from: "X16Y72", to: "X20Y72" }, { from: "X20Y72", to: "X24Y72" },
    { from: "X24Y72", to: "X28Y72" }, { from: "X28Y72", to: "X32Y72" }, { from: "X32Y72", to: "X36Y72" },
    { from: "X36Y72", to: "X40Y72" }, { from: "X40Y72", to: "X44Y72" }, { from: "X44Y72", to: "X48Y72" },
    { from: "X48Y72", to: "X52Y72" }, { from: "X52Y72", to: "X56Y72" }, { from: "X56Y72", to: "X60Y72" },
    { from: "X60Y72", to: "X64Y72" }, { from: "X64Y72", to: "X68Y72" }, { from: "X68Y72", to: "X72Y72" },
    { from: "X72Y72", to: "X76Y72" }, { from: "X76Y72", to: "X80Y72" }, { from: "X80Y72", to: "X84Y72" },
    { from: "X84Y72", to: "X88Y72" }, { from: "X88Y72", to: "X92Y72" }, { from: "X92Y72", to: "X96Y72" },
    { from: "X96Y72", to: "X100Y72" },

    // --- Row Y = 76 ---
    { from: "X0Y76", to: "X4Y76" }, { from: "X4Y76", to: "X8Y76" }, { from: "X8Y76", to: "X12Y76" },
    { from: "X12Y76", to: "X16Y76" }, { from: "X16Y76", to: "X20Y76" }, { from: "X20Y76", to: "X24Y76" },
    { from: "X24Y76", to: "X28Y76" }, { from: "X28Y76", to: "X32Y76" }, { from: "X32Y76", to: "X36Y76" },
    { from: "X36Y76", to: "X40Y76" }, { from: "X40Y76", to: "X44Y76" }, { from: "X44Y76", to: "X48Y76" },
    { from: "X48Y76", to: "X52Y76" }, { from: "X52Y76", to: "X56Y76" }, { from: "X56Y76", to: "X60Y76" },
    { from: "X60Y76", to: "X64Y76" }, { from: "X64Y76", to: "X68Y76" }, { from: "X68Y76", to: "X72Y76" },
    { from: "X72Y76", to: "X76Y76" }, { from: "X76Y76", to: "X80Y76" }, { from: "X80Y76", to: "X84Y76" },
    { from: "X84Y76", to: "X88Y76" }, { from: "X88Y76", to: "X92Y76" }, { from: "X92Y76", to: "X96Y76" },
    { from: "X96Y76", to: "X100Y76" },

    // --- Row Y = 80 ---
    { from: "X0Y80", to: "X4Y80" }, { from: "X4Y80", to: "X8Y80" }, { from: "X8Y80", to: "X12Y80" },
    { from: "X12Y80", to: "X16Y80" }, { from: "X16Y80", to: "X20Y80" }, { from: "X20Y80", to: "X24Y80" },
    { from: "X24Y80", to: "X28Y80" }, { from: "X28Y80", to: "X32Y80" }, { from: "X32Y80", to: "X36Y80" },
    { from: "X36Y80", to: "X40Y80" }, { from: "X40Y80", to: "X44Y80" }, { from: "X44Y80", to: "X48Y80" },
    { from: "X48Y80", to: "X52Y80" }, { from: "X52Y80", to: "X56Y80" }, { from: "X56Y80", to: "X60Y80" },
    { from: "X60Y80", to: "X64Y80" }, { from: "X64Y80", to: "X68Y80" }, { from: "X68Y80", to: "X72Y80" },
    { from: "X72Y80", to: "X76Y80" }, { from: "X76Y80", to: "X80Y80" }, { from: "X80Y80", to: "X84Y80" },
    { from: "X84Y80", to: "X88Y80" }, { from: "X88Y80", to: "X92Y80" }, { from: "X92Y80", to: "X96Y80" },
    { from: "X96Y80", to: "X100Y80" },

    // --- Row Y = 84 ---
    { from: "X0Y84", to: "X4Y84" }, { from: "X4Y84", to: "X8Y84" }, { from: "X8Y84", to: "X12Y84" },
    { from: "X12Y84", to: "X16Y84" }, { from: "X16Y84", to: "X20Y84" }, { from: "X20Y84", to: "X24Y84" },
    { from: "X24Y84", to: "X28Y84" }, { from: "X28Y84", to: "X32Y84" }, { from: "X32Y84", to: "X36Y84" },
    { from: "X36Y84", to: "X40Y84" }, { from: "X40Y84", to: "X44Y84" }, { from: "X44Y84", to: "X48Y84" },
    { from: "X48Y84", to: "X52Y84" },
    // { from: "X52Y84", to: "X56Y84" }, 
    { from: "X56Y84", to: "X60Y84" },
    { from: "X60Y84", to: "X64Y84" }, { from: "X64Y84", to: "X68Y84" }, { from: "X68Y84", to: "X72Y84" },
    { from: "X72Y84", to: "X76Y84" }, { from: "X76Y84", to: "X80Y84" }, { from: "X80Y84", to: "X84Y84" },
    { from: "X84Y84", to: "X88Y84" }, { from: "X88Y84", to: "X92Y84" }, { from: "X92Y84", to: "X96Y84" },
    { from: "X96Y84", to: "X100Y84" },

    // --- Row Y = 88 ---
    { from: "X0Y88", to: "X4Y88" }, { from: "X4Y88", to: "X8Y88" }, { from: "X8Y88", to: "X12Y88" },
    { from: "X12Y88", to: "X16Y88" }, { from: "X16Y88", to: "X20Y88" }, { from: "X20Y88", to: "X24Y88" },
    { from: "X24Y88", to: "X28Y88" }, { from: "X28Y88", to: "X32Y88" }, { from: "X32Y88", to: "X36Y88" },
    { from: "X36Y88", to: "X40Y88" }, { from: "X40Y88", to: "X44Y88" }, { from: "X44Y88", to: "X48Y88" },
    //{ from: "X48Y88", to: "X52Y88" }, { from: "X52Y88", to: "X56Y88" }, { from: "X56Y88", to: "X60Y88" },
    { from: "X60Y88", to: "X64Y88" }, { from: "X64Y88", to: "X68Y88" }, { from: "X68Y88", to: "X72Y88" },
    { from: "X72Y88", to: "X76Y88" }, { from: "X76Y88", to: "X80Y88" }, { from: "X80Y88", to: "X84Y88" },
    { from: "X84Y88", to: "X88Y88" }, { from: "X88Y88", to: "X92Y88" }, { from: "X92Y88", to: "X96Y88" },
    { from: "X96Y88", to: "X100Y88" },

    // --- Row Y = 92 ---
    { from: "X0Y92", to: "X4Y92" }, { from: "X4Y92", to: "X8Y92" }, { from: "X8Y92", to: "X12Y92" },
    { from: "X12Y92", to: "X16Y92" }, { from: "X16Y92", to: "X20Y92" }, { from: "X20Y92", to: "X24Y92" },
    { from: "X24Y92", to: "X28Y92" }, { from: "X28Y92", to: "X32Y92" }, { from: "X32Y92", to: "X36Y92" },
    { from: "X36Y92", to: "X40Y92" }, { from: "X40Y92", to: "X44Y92" }, 
    // { from: "X44Y92", to: "X48Y92" },
    // { from: "X48Y92", to: "X52Y92" }, { from: "X52Y92", to: "X56Y92" }, { from: "X56Y92", to: "X60Y92" },
    // { from: "X60Y92", to: "X64Y92" }, { from: "X64Y92", to: "X68Y92" }, 
    { from: "X68Y92", to: "X72Y92" },
    { from: "X72Y92", to: "X76Y92" }, { from: "X76Y92", to: "X80Y92" }, { from: "X80Y92", to: "X84Y92" },
    { from: "X84Y92", to: "X88Y92" }, { from: "X88Y92", to: "X92Y92" }, { from: "X92Y92", to: "X96Y92" },
    { from: "X96Y92", to: "X100Y92" },

    // --- Row Y = 96 ---
    { from: "X0Y96", to: "X4Y96" }, { from: "X4Y96", to: "X8Y96" }, { from: "X8Y96", to: "X12Y96" },
    { from: "X12Y96", to: "X16Y96" }, { from: "X16Y96", to: "X20Y96" }, { from: "X20Y96", to: "X24Y96" },
    { from: "X24Y96", to: "X28Y96" }, { from: "X28Y96", to: "X32Y96" }, { from: "X32Y96", to: "X36Y96" },
    { from: "X36Y96", to: "X40Y96" }, 
    // { from: "X40Y96", to: "X44Y96" }, { from: "X44Y96", to: "X48Y96" },
    // { from: "X48Y96", to: "X52Y96" }, { from: "X52Y96", to: "X56Y96" }, { from: "X56Y96", to: "X60Y96" },
    // { from: "X60Y96", to: "X64Y96" }, { from: "X64Y96", to: "X68Y96" }, { from: "X68Y96", to: "X72Y96" },
    { from: "X72Y96", to: "X76Y96" }, { from: "X76Y96", to: "X80Y96" }, { from: "X80Y96", to: "X84Y96" },
    { from: "X84Y96", to: "X88Y96" }, { from: "X88Y96", to: "X92Y96" }, { from: "X92Y96", to: "X96Y96" },
    { from: "X96Y96", to: "X100Y96" },

    // --- Row Y = 100 ---
    { from: "X0Y100", to: "X4Y100" }, { from: "X4Y100", to: "X8Y100" }, { from: "X8Y100", to: "X12Y100" },
    { from: "X12Y100", to: "X16Y100" }, { from: "X16Y100", to: "X20Y100" }, { from: "X20Y100", to: "X24Y100" },
    { from: "X24Y100", to: "X28Y100" }, { from: "X28Y100", to: "X32Y100" }, { from: "X32Y100", to: "X36Y100" },
    { from: "X36Y100", to: "X40Y100" }, { from: "X40Y100", to: "X44Y100" }, { from: "X44Y100", to: "X48Y100" },
    { from: "X48Y100", to: "X52Y100" }, { from: "X52Y100", to: "X56Y100" }, { from: "X56Y100", to: "X60Y100" },
    { from: "X60Y100", to: "X64Y100" }, { from: "X64Y100", to: "X68Y100" }, { from: "X68Y100", to: "X72Y100" },
    { from: "X72Y100", to: "X76Y100" }, { from: "X76Y100", to: "X80Y100" }, { from: "X80Y100", to: "X84Y100" },
    { from: "X84Y100", to: "X88Y100" }, { from: "X88Y100", to: "X92Y100" }, { from: "X92Y100", to: "X96Y100" },
    { from: "X96Y100", to: "X100Y100" },

    // ==========================================
    // 3. VERTICAL EDGES (Up <-> Down)
    // ==========================================

    // --- Column X = 0 ---
    { from: "X0Y0", to: "X0Y4" }, { from: "X0Y4", to: "X0Y8" }, { from: "X0Y8", to: "X0Y12" },
    { from: "X0Y12", to: "X0Y16" }, { from: "X0Y16", to: "X0Y20" }, { from: "X0Y20", to: "X0Y24" },
    { from: "X0Y24", to: "X0Y28" }, { from: "X0Y28", to: "X0Y32" }, { from: "X0Y32", to: "X0Y36" },
    { from: "X0Y36", to: "X0Y40" }, { from: "X0Y40", to: "X0Y44" }, { from: "X0Y44", to: "X0Y48" },
    { from: "X0Y48", to: "X0Y52" }, { from: "X0Y52", to: "X0Y56" }, { from: "X0Y56", to: "X0Y60" },
    { from: "X0Y60", to: "X0Y64" }, { from: "X0Y64", to: "X0Y68" }, { from: "X0Y68", to: "X0Y72" },
    { from: "X0Y72", to: "X0Y76" }, { from: "X0Y76", to: "X0Y80" }, { from: "X0Y80", to: "X0Y84" },
    { from: "X0Y84", to: "X0Y88" }, { from: "X0Y88", to: "X0Y92" }, { from: "X0Y92", to: "X0Y96" },
    { from: "X0Y96", to: "X0Y100" },

    // --- Column X = 4 ---
    { from: "X4Y0", to: "X4Y4" }, { from: "X4Y4", to: "X4Y8" }, { from: "X4Y8", to: "X4Y12" },
    { from: "X4Y12", to: "X4Y16" }, { from: "X4Y16", to: "X4Y20" }, { from: "X4Y20", to: "X4Y24" },
    { from: "X4Y24", to: "X4Y28" }, { from: "X4Y28", to: "X4Y32" }, { from: "X4Y32", to: "X4Y36" },
    { from: "X4Y36", to: "X4Y40" }, { from: "X4Y40", to: "X4Y44" }, { from: "X4Y44", to: "X4Y48" },
    { from: "X4Y48", to: "X4Y52" }, { from: "X4Y52", to: "X4Y56" }, { from: "X4Y56", to: "X4Y60" },
    { from: "X4Y60", to: "X4Y64" }, { from: "X4Y64", to: "X4Y68" }, { from: "X4Y68", to: "X4Y72" },
    { from: "X4Y72", to: "X4Y76" }, { from: "X4Y76", to: "X4Y80" }, { from: "X4Y80", to: "X4Y84" },
    { from: "X4Y84", to: "X4Y88" }, { from: "X4Y88", to: "X4Y92" }, { from: "X4Y92", to: "X4Y96" },
    { from: "X4Y96", to: "X4Y100" },

    // --- Column X = 8 ---
    { from: "X8Y0", to: "X8Y4" }, { from: "X8Y4", to: "X8Y8" }, { from: "X8Y8", to: "X8Y12" },
    { from: "X8Y12", to: "X8Y16" }, { from: "X8Y16", to: "X8Y20" }, { from: "X8Y20", to: "X8Y24" },
    { from: "X8Y24", to: "X8Y28" }, { from: "X8Y28", to: "X8Y32" }, { from: "X8Y32", to: "X8Y36" },
    { from: "X8Y36", to: "X8Y40" }, { from: "X8Y40", to: "X8Y44" }, { from: "X8Y44", to: "X8Y48" },
    { from: "X8Y48", to: "X8Y52" }, { from: "X8Y52", to: "X8Y56" }, { from: "X8Y56", to: "X8Y60" },
    { from: "X8Y60", to: "X8Y64" }, { from: "X8Y64", to: "X8Y68" }, { from: "X8Y68", to: "X8Y72" },
    { from: "X8Y72", to: "X8Y76" }, { from: "X8Y76", to: "X8Y80" }, { from: "X8Y80", to: "X8Y84" },
    { from: "X8Y84", to: "X8Y88" }, { from: "X8Y88", to: "X8Y92" }, { from: "X8Y92", to: "X8Y96" },
    { from: "X8Y96", to: "X8Y100" },

    // --- Column X = 12 ---
    { from: "X12Y0", to: "X12Y4" }, { from: "X12Y4", to: "X12Y8" }, { from: "X12Y8", to: "X12Y12" },
    { from: "X12Y12", to: "X12Y16" }, { from: "X12Y16", to: "X12Y20" }, { from: "X12Y20", to: "X12Y24" },
    { from: "X12Y24", to: "X12Y28" }, { from: "X12Y28", to: "X12Y32" }, { from: "X12Y32", to: "X12Y36" },
    { from: "X12Y36", to: "X12Y40" }, { from: "X12Y40", to: "X12Y44" }, { from: "X12Y44", to: "X12Y48" },
    { from: "X12Y48", to: "X12Y52" }, { from: "X12Y52", to: "X12Y56" }, { from: "X12Y56", to: "X12Y60" },
    { from: "X12Y60", to: "X12Y64" }, { from: "X12Y64", to: "X12Y68" }, { from: "X12Y68", to: "X12Y72" },
    { from: "X12Y72", to: "X12Y76" }, { from: "X12Y76", to: "X12Y80" }, { from: "X12Y80", to: "X12Y84" },
    { from: "X12Y84", to: "X12Y88" }, { from: "X12Y88", to: "X12Y92" }, { from: "X12Y92", to: "X12Y96" },
    { from: "X12Y96", to: "X12Y100" },

    // --- Column X = 16 ---
    { from: "X16Y0", to: "X16Y4" }, { from: "X16Y4", to: "X16Y8" }, { from: "X16Y8", to: "X16Y12" },
    { from: "X16Y12", to: "X16Y16" }, { from: "X16Y16", to: "X16Y20" }, { from: "X16Y20", to: "X16Y24" },
    { from: "X16Y24", to: "X16Y28" }, { from: "X16Y28", to: "X16Y32" }, { from: "X16Y32", to: "X16Y36" },
    { from: "X16Y36", to: "X16Y40" }, 
    { from: "X16Y40", to: "X16Y44" }, { from: "X16Y44", to: "X16Y48" },
    { from: "X16Y48", to: "X16Y52" }, 
    { from: "X16Y52", to: "X16Y56" }, { from: "X16Y56", to: "X16Y60" },
    { from: "X16Y60", to: "X16Y64" }, { from: "X16Y64", to: "X16Y68" }, { from: "X16Y68", to: "X16Y72" },
    { from: "X16Y72", to: "X16Y76" }, { from: "X16Y76", to: "X16Y80" }, { from: "X16Y80", to: "X16Y84" },
    { from: "X16Y84", to: "X16Y88" }, { from: "X16Y88", to: "X16Y92" }, { from: "X16Y92", to: "X16Y96" },
    { from: "X16Y96", to: "X16Y100" },

    // --- Column X = 20 ---
    { from: "X20Y0", to: "X20Y4" }, { from: "X20Y4", to: "X20Y8" }, { from: "X20Y8", to: "X20Y12" },
    { from: "X20Y12", to: "X20Y16" }, { from: "X20Y16", to: "X20Y20" }, { from: "X20Y20", to: "X20Y24" },
    { from: "X20Y24", to: "X20Y28" }, { from: "X20Y28", to: "X20Y32" }, { from: "X20Y32", to: "X20Y36" },
    // { from: "X20Y36", to: "X20Y40" }, { from: "X20Y40", to: "X20Y44" }, { from: "X20Y44", to: "X20Y48" },
    // { from: "X20Y48", to: "X20Y52" },
     { from: "X20Y52", to: "X20Y56" }, { from: "X20Y56", to: "X20Y60" },
    { from: "X20Y60", to: "X20Y64" }, { from: "X20Y64", to: "X20Y68" }, { from: "X20Y68", to: "X20Y72" },
    { from: "X20Y72", to: "X20Y76" }, { from: "X20Y76", to: "X20Y80" }, { from: "X20Y80", to: "X20Y84" },
    { from: "X20Y84", to: "X20Y88" }, { from: "X20Y88", to: "X20Y92" }, { from: "X20Y92", to: "X20Y96" },
    { from: "X20Y96", to: "X20Y100" },

    // --- Column X = 24 ---
    { from: "X24Y0", to: "X24Y4" }, { from: "X24Y4", to: "X24Y8" }, { from: "X24Y8", to: "X24Y12" },
    { from: "X24Y12", to: "X24Y16" }, { from: "X24Y16", to: "X24Y20" }, { from: "X24Y20", to: "X24Y24" },
    // { from: "X24Y24", to: "X24Y28" }, { from: "X24Y28", to: "X24Y32" }, { from: "X24Y32", to: "X24Y36" },
    // { from: "X24Y36", to: "X24Y40" }, { from: "X24Y40", to: "X24Y44" }, 
    // { from: "X24Y44", to: "X24Y48" },
    //{ from: "X24Y48", to: "X24Y52" }, { from: "X24Y52", to: "X24Y56" }, { from: "X24Y56", to: "X24Y60" },
    { from: "X24Y60", to: "X24Y64" }, { from: "X24Y64", to: "X24Y68" }, { from: "X24Y68", to: "X24Y72" },
    { from: "X24Y72", to: "X24Y76" }, { from: "X24Y76", to: "X24Y80" }, { from: "X24Y80", to: "X24Y84" },
    { from: "X24Y84", to: "X24Y88" }, { from: "X24Y88", to: "X24Y92" }, { from: "X24Y92", to: "X24Y96" },
    { from: "X24Y96", to: "X24Y100" },

    // --- Column X = 28 ---
    { from: "X28Y0", to: "X28Y4" }, { from: "X28Y4", to: "X28Y8" }, { from: "X28Y8", to: "X28Y12" },
    { from: "X28Y12", to: "X28Y16" },
    //  { from: "X28Y16", to: "X28Y20" }, { from: "X28Y20", to: "X28Y24" },
    // { from: "X28Y24", to: "X28Y28" }, { from: "X28Y28", to: "X28Y32" }, { from: "X28Y32", to: "X28Y36" },
    // { from: "X28Y36", to: "X28Y40" }, { from: "X28Y40", to: "X28Y44" }, { from: "X28Y44", to: "X28Y48" },
    // { from: "X28Y48", to: "X28Y52" }, { from: "X28Y52", to: "X28Y56" }, { from: "X28Y56", to: "X28Y60" },
    // { from: "X28Y60", to: "X28Y64" }, 
    { from: "X28Y64", to: "X28Y68" }, { from: "X28Y68", to: "X28Y72" },
    { from: "X28Y72", to: "X28Y76" }, { from: "X28Y76", to: "X28Y80" }, { from: "X28Y80", to: "X28Y84" },
    { from: "X28Y84", to: "X28Y88" }, { from: "X28Y88", to: "X28Y92" }, { from: "X28Y92", to: "X28Y96" },
    { from: "X28Y96", to: "X28Y100" },

    // --- Column X = 32 ---
    { from: "X32Y0", to: "X32Y4" }, { from: "X32Y4", to: "X32Y8" }, { from: "X32Y8", to: "X32Y12" },
    // { from: "X32Y12", to: "X32Y16" }, { from: "X32Y16", to: "X32Y20" }, { from: "X32Y20", to: "X32Y24" },
    // { from: "X32Y24", to: "X32Y28" }, { from: "X32Y28", to: "X32Y32" }, { from: "X32Y32", to: "X32Y36" },
    // { from: "X32Y36", to: "X32Y40" }, { from: "X32Y40", to: "X32Y44" }, { from: "X32Y44", to: "X32Y48" },
    // { from: "X32Y48", to: "X32Y52" }, { from: "X32Y52", to: "X32Y56" }, { from: "X32Y56", to: "X32Y60" },
    // { from: "X32Y60", to: "X32Y64" }, { from: "X32Y64", to: "X32Y68" }, 
    { from: "X32Y68", to: "X32Y72" },
    { from: "X32Y72", to: "X32Y76" }, { from: "X32Y76", to: "X32Y80" }, { from: "X32Y80", to: "X32Y84" },
    { from: "X32Y84", to: "X32Y88" }, { from: "X32Y88", to: "X32Y92" }, { from: "X32Y92", to: "X32Y96" },
    { from: "X32Y96", to: "X32Y100" },

    // --- Column X = 36 ---
    { from: "X36Y0", to: "X36Y4" }, { from: "X36Y4", to: "X36Y8" }, { from: "X36Y8", to: "X36Y12" },
    // { from: "X36Y12", to: "X36Y16" },
    //  { from: "X36Y16", to: "X36Y20" }, { from: "X36Y20", to: "X36Y24" },
    // { from: "X36Y24", to: "X36Y28" }, { from: "X36Y28", to: "X36Y32" }, { from: "X36Y32", to: "X36Y36" },
    // { from: "X36Y36", to: "X36Y40" }, { from: "X36Y40", to: "X36Y44" }, { from: "X36Y44", to: "X36Y48" },
    // { from: "X36Y48", to: "X36Y52" }, { from: "X36Y52", to: "X36Y56" }, { from: "X36Y56", to: "X36Y60" },
    // { from: "X36Y60", to: "X36Y64" }, { from: "X36Y64", to: "X36Y68" }, { from: "X36Y68", to: "X36Y72" },
    { from: "X36Y72", to: "X36Y76" }, { from: "X36Y76", to: "X36Y80" }, { from: "X36Y80", to: "X36Y84" },
    { from: "X36Y84", to: "X36Y88" }, { from: "X36Y88", to: "X36Y92" }, { from: "X36Y92", to: "X36Y96" },
    { from: "X36Y96", to: "X36Y100" },

    // --- Column X = 40 ---
    { from: "X40Y0", to: "X40Y4" }, { from: "X40Y4", to: "X40Y8" }, { from: "X40Y8", to: "X40Y12" },
    { from: "X40Y12", to: "X40Y16" }, 
    // { from: "X40Y16", to: "X40Y20" }, { from: "X40Y20", to: "X40Y24" },
    // { from: "X40Y24", to: "X40Y28" },
     { from: "X40Y28", to: "X40Y32" },
    //   { from: "X40Y32", to: "X40Y36" },
    // { from: "X40Y36", to: "X40Y40" }, { from: "X40Y40", to: "X40Y44" }, { from: "X40Y44", to: "X40Y48" },
    // { from: "X40Y48", to: "X40Y52" }, 
    // { from: "X40Y52", to: "X40Y56" }, { from: "X40Y56", to: "X40Y60" },
    // { from: "X40Y60", to: "X40Y64" }, { from: "X40Y64", to: "X40Y68" },
     { from: "X40Y68", to: "X40Y72" },
    { from: "X40Y72", to: "X40Y76" }, { from: "X40Y76", to: "X40Y80" }, { from: "X40Y80", to: "X40Y84" },
    { from: "X40Y84", to: "X40Y88" }, { from: "X40Y88", to: "X40Y92" }, { from: "X40Y92", to: "X40Y96" },
    { from: "X40Y96", to: "X40Y100" },

    // --- Column X = 44 ---
    { from: "X44Y0", to: "X44Y4" }, { from: "X44Y4", to: "X44Y8" }, { from: "X44Y8", to: "X44Y12" },
    { from: "X44Y12", to: "X44Y16" }, 
    // { from: "X44Y16", to: "X44Y20" },
    //  { from: "X44Y20", to: "X44Y24" },
    { from: "X44Y24", to: "X44Y28" }, { from: "X44Y28", to: "X44Y32" }, { from: "X44Y32", to: "X44Y36" },
    // { from: "X44Y36", to: "X44Y40" }, { from: "X44Y40", to: "X44Y44" }, 
    { from: "X44Y44", to: "X44Y48" },
    { from: "X44Y48", to: "X44Y52" }, 
    // { from: "X44Y52", to: "X44Y56" }, { from: "X44Y56", to: "X44Y60" },
    { from: "X44Y60", to: "X44Y64" }, { from: "X44Y64", to: "X44Y68" }, { from: "X44Y68", to: "X44Y72" },
    { from: "X44Y72", to: "X44Y76" }, { from: "X44Y76", to: "X44Y80" }, { from: "X44Y80", to: "X44Y84" },
    { from: "X44Y84", to: "X44Y88" }, 
    { from: "X44Y88", to: "X44Y92" }, 
    // { from: "X44Y92", to: "X44Y96" },
    // { from: "X44Y96", to: "X44Y100" },

    // --- Column X = 48 ---
    { from: "X48Y0", to: "X48Y4" }, { from: "X48Y4", to: "X48Y8" }, { from: "X48Y8", to: "X48Y12" },
    { from: "X48Y12", to: "X48Y16" }, { from: "X48Y16", to: "X48Y20" }, { from: "X48Y20", to: "X48Y24" },
    { from: "X48Y24", to: "X48Y28" }, { from: "X48Y28", to: "X48Y32" }, { from: "X48Y32", to: "X48Y36" },
    { from: "X48Y36", to: "X48Y40" }, { from: "X48Y40", to: "X48Y44" }, { from: "X48Y44", to: "X48Y48" },
    { from: "X48Y48", to: "X48Y52" }, { from: "X48Y52", to: "X48Y56" }, { from: "X48Y56", to: "X48Y60" },
    { from: "X48Y60", to: "X48Y64" }, { from: "X48Y64", to: "X48Y68" }, { from: "X48Y68", to: "X48Y72" },
    { from: "X48Y72", to: "X48Y76" }, { from: "X48Y76", to: "X48Y80" }, { from: "X48Y80", to: "X48Y84" },
    { from: "X48Y84", to: "X48Y88" }, 
    // { from: "X48Y88", to: "X48Y92" }, { from: "X48Y92", to: "X48Y96" },
    // { from: "X48Y96", to: "X48Y100" },

    // --- Column X = 52 ---
    { from: "X52Y0", to: "X52Y4" }, { from: "X52Y4", to: "X52Y8" }, { from: "X52Y8", to: "X52Y12" },
    { from: "X52Y12", to: "X52Y16" }, { from: "X52Y16", to: "X52Y20" }, { from: "X52Y20", to: "X52Y24" },
    { from: "X52Y24", to: "X52Y28" }, { from: "X52Y28", to: "X52Y32" }, { from: "X52Y32", to: "X52Y36" },
    { from: "X52Y36", to: "X52Y40" }, { from: "X52Y40", to: "X52Y44" }, { from: "X52Y44", to: "X52Y48" },
    { from: "X52Y48", to: "X52Y52" }, { from: "X52Y52", to: "X52Y56" }, { from: "X52Y56", to: "X52Y60" },
    { from: "X52Y60", to: "X52Y64" }, { from: "X52Y64", to: "X52Y68" }, { from: "X52Y68", to: "X52Y72" },
    { from: "X52Y72", to: "X52Y76" }, { from: "X52Y76", to: "X52Y80" }, { from: "X52Y80", to: "X52Y84" },
    // { from: "X52Y84", to: "X52Y88" }, { from: "X52Y88", to: "X52Y92" }, { from: "X52Y92", to: "X52Y96" },
    // { from: "X52Y96", to: "X52Y100" },

    // --- Column X = 56 ---
    { from: "X56Y0", to: "X56Y4" }, { from: "X56Y4", to: "X56Y8" }, { from: "X56Y8", to: "X56Y12" },
    { from: "X56Y12", to: "X56Y16" }, { from: "X56Y16", to: "X56Y20" }, { from: "X56Y20", to: "X56Y24" },
    { from: "X56Y24", to: "X56Y28" }, { from: "X56Y28", to: "X56Y32" }, { from: "X56Y32", to: "X56Y36" },
    { from: "X56Y36", to: "X56Y40" }, { from: "X56Y40", to: "X56Y44" }, { from: "X56Y44", to: "X56Y48" },
    { from: "X56Y48", to: "X56Y52" }, { from: "X56Y52", to: "X56Y56" }, { from: "X56Y56", to: "X56Y60" },
    { from: "X56Y60", to: "X56Y64" }, { from: "X56Y64", to: "X56Y68" }, { from: "X56Y68", to: "X56Y72" },
    { from: "X56Y72", to: "X56Y76" }, { from: "X56Y76", to: "X56Y80" }, { from: "X56Y80", to: "X56Y84" },
    // { from: "X56Y84", to: "X56Y88" }, 
    // { from: "X56Y88", to: "X56Y92" }, { from: "X56Y92", to: "X56Y96" },
    // { from: "X56Y96", to: "X56Y100" },

    // --- Column X = 60 ---
    { from: "X60Y0", to: "X60Y4" }, { from: "X60Y4", to: "X60Y8" }, { from: "X60Y8", to: "X60Y12" },
    { from: "X60Y12", to: "X60Y16" }, { from: "X60Y16", to: "X60Y20" }, { from: "X60Y20", to: "X60Y24" },
    { from: "X60Y24", to: "X60Y28" }, { from: "X60Y28", to: "X60Y32" }, { from: "X60Y32", to: "X60Y36" },
    { from: "X60Y36", to: "X60Y40" }, { from: "X60Y40", to: "X60Y44" }, { from: "X60Y44", to: "X60Y48" },
    { from: "X60Y48", to: "X60Y52" }, { from: "X60Y52", to: "X60Y56" }, { from: "X60Y56", to: "X60Y60" },
    { from: "X60Y60", to: "X60Y64" }, { from: "X60Y64", to: "X60Y68" }, { from: "X60Y68", to: "X60Y72" },
    { from: "X60Y72", to: "X60Y76" }, { from: "X60Y76", to: "X60Y80" }, { from: "X60Y80", to: "X60Y84" },
    { from: "X60Y84", to: "X60Y88" },
    // { from: "X60Y88", to: "X60Y92" }, { from: "X60Y92", to: "X60Y96" },
    // { from: "X60Y96", to: "X60Y100" },

    // --- Column X = 64 ---
    { from: "X64Y0", to: "X64Y4" }, { from: "X64Y4", to: "X64Y8" }, { from: "X64Y8", to: "X64Y12" },
    { from: "X64Y12", to: "X64Y16" }, { from: "X64Y16", to: "X64Y20" }, { from: "X64Y20", to: "X64Y24" },
    { from: "X64Y24", to: "X64Y28" }, { from: "X64Y28", to: "X64Y32" }, { from: "X64Y32", to: "X64Y36" },
    { from: "X64Y36", to: "X64Y40" }, { from: "X64Y40", to: "X64Y44" }, { from: "X64Y44", to: "X64Y48" },
    { from: "X64Y48", to: "X64Y52" }, { from: "X64Y52", to: "X64Y56" }, { from: "X64Y56", to: "X64Y60" },
    { from: "X64Y60", to: "X64Y64" }, { from: "X64Y64", to: "X64Y68" }, { from: "X64Y68", to: "X64Y72" },
    { from: "X64Y72", to: "X64Y76" }, { from: "X64Y76", to: "X64Y80" }, { from: "X64Y80", to: "X64Y84" },
    { from: "X64Y84", to: "X64Y88" },
    // { from: "X64Y88", to: "X64Y92" }, { from: "X64Y92", to: "X64Y96" },
    // { from: "X64Y96", to: "X64Y100" },

    // --- Column X = 68 ---
    { from: "X68Y0", to: "X68Y4" }, { from: "X68Y4", to: "X68Y8" }, { from: "X68Y8", to: "X68Y12" },
    { from: "X68Y12", to: "X68Y16" }, { from: "X68Y16", to: "X68Y20" }, { from: "X68Y20", to: "X68Y24" },
    { from: "X68Y24", to: "X68Y28" }, { from: "X68Y28", to: "X68Y32" }, { from: "X68Y32", to: "X68Y36" },
    { from: "X68Y36", to: "X68Y40" }, { from: "X68Y40", to: "X68Y44" }, { from: "X68Y44", to: "X68Y48" },
    { from: "X68Y48", to: "X68Y52" }, { from: "X68Y52", to: "X68Y56" }, { from: "X68Y56", to: "X68Y60" },
    { from: "X68Y60", to: "X68Y64" }, { from: "X68Y64", to: "X68Y68" }, { from: "X68Y68", to: "X68Y72" },
    { from: "X68Y72", to: "X68Y76" }, { from: "X68Y76", to: "X68Y80" }, { from: "X68Y80", to: "X68Y84" },
    { from: "X68Y84", to: "X68Y88" }, { from: "X68Y88", to: "X68Y92" }, 
    // { from: "X68Y92", to: "X68Y96" },
    // { from: "X68Y96", to: "X68Y100" },

    // --- Column X = 72 ---
    { from: "X72Y0", to: "X72Y4" }, { from: "X72Y4", to: "X72Y8" }, { from: "X72Y8", to: "X72Y12" },
    { from: "X72Y12", to: "X72Y16" }, { from: "X72Y16", to: "X72Y20" }, { from: "X72Y20", to: "X72Y24" },
    { from: "X72Y24", to: "X72Y28" }, { from: "X72Y28", to: "X72Y32" }, { from: "X72Y32", to: "X72Y36" },
    { from: "X72Y36", to: "X72Y40" }, { from: "X72Y40", to: "X72Y44" }, { from: "X72Y44", to: "X72Y48" },
    { from: "X72Y48", to: "X72Y52" }, { from: "X72Y52", to: "X72Y56" }, { from: "X72Y56", to: "X72Y60" },
    { from: "X72Y60", to: "X72Y64" }, { from: "X72Y64", to: "X72Y68" }, { from: "X72Y68", to: "X72Y72" },
    { from: "X72Y72", to: "X72Y76" }, { from: "X72Y76", to: "X72Y80" }, { from: "X72Y80", to: "X72Y84" },
    { from: "X72Y84", to: "X72Y88" }, { from: "X72Y88", to: "X72Y92" }, { from: "X72Y92", to: "X72Y96" },
    { from: "X72Y96", to: "X72Y100" },

    // --- Column X = 76 ---
    { from: "X76Y0", to: "X76Y4" }, { from: "X76Y4", to: "X76Y8" }, { from: "X76Y8", to: "X76Y12" },
    { from: "X76Y12", to: "X76Y16" }, { from: "X76Y16", to: "X76Y20" }, { from: "X76Y20", to: "X76Y24" },
    { from: "X76Y24", to: "X76Y28" }, { from: "X76Y28", to: "X76Y32" }, { from: "X76Y32", to: "X76Y36" },
    { from: "X76Y36", to: "X76Y40" }, { from: "X76Y40", to: "X76Y44" }, { from: "X76Y44", to: "X76Y48" },
    { from: "X76Y48", to: "X76Y52" }, { from: "X76Y52", to: "X76Y56" }, { from: "X76Y56", to: "X76Y60" },
    { from: "X76Y60", to: "X76Y64" }, { from: "X76Y64", to: "X76Y68" }, { from: "X76Y68", to: "X76Y72" },
    { from: "X76Y72", to: "X76Y76" }, { from: "X76Y76", to: "X76Y80" }, { from: "X76Y80", to: "X76Y84" },
    { from: "X76Y84", to: "X76Y88" }, { from: "X76Y88", to: "X76Y92" }, { from: "X76Y92", to: "X76Y96" },
    { from: "X76Y96", to: "X76Y100" },

    // --- Column X = 80 ---
    { from: "X80Y0", to: "X80Y4" }, { from: "X80Y4", to: "X80Y8" }, { from: "X80Y8", to: "X80Y12" },
    { from: "X80Y12", to: "X80Y16" }, { from: "X80Y16", to: "X80Y20" }, { from: "X80Y20", to: "X80Y24" },
    { from: "X80Y24", to: "X80Y28" }, { from: "X80Y28", to: "X80Y32" }, { from: "X80Y32", to: "X80Y36" },
    { from: "X80Y36", to: "X80Y40" }, { from: "X80Y40", to: "X80Y44" }, { from: "X80Y44", to: "X80Y48" },
    { from: "X80Y48", to: "X80Y52" }, { from: "X80Y52", to: "X80Y56" }, { from: "X80Y56", to: "X80Y60" },
    { from: "X80Y60", to: "X80Y64" }, { from: "X80Y64", to: "X80Y68" }, { from: "X80Y68", to: "X80Y72" },
    { from: "X80Y72", to: "X80Y76" }, { from: "X80Y76", to: "X80Y80" }, { from: "X80Y80", to: "X80Y84" },
    { from: "X80Y84", to: "X80Y88" }, { from: "X80Y88", to: "X80Y92" }, { from: "X80Y92", to: "X80Y96" },
    { from: "X80Y96", to: "X80Y100" },

    // --- Column X = 84 ---
    { from: "X84Y0", to: "X84Y4" }, { from: "X84Y4", to: "X84Y8" }, { from: "X84Y8", to: "X84Y12" },
    { from: "X84Y12", to: "X84Y16" }, { from: "X84Y16", to: "X84Y20" }, { from: "X84Y20", to: "X84Y24" },
    { from: "X84Y24", to: "X84Y28" }, { from: "X84Y28", to: "X84Y32" }, { from: "X84Y32", to: "X84Y36" },
    { from: "X84Y36", to: "X84Y40" }, { from: "X84Y40", to: "X84Y44" }, { from: "X84Y44", to: "X84Y48" },
    { from: "X84Y48", to: "X84Y52" }, { from: "X84Y52", to: "X84Y56" }, { from: "X84Y56", to: "X84Y60" },
    { from: "X84Y60", to: "X84Y64" }, { from: "X84Y64", to: "X84Y68" }, { from: "X84Y68", to: "X84Y72" },
    { from: "X84Y72", to: "X84Y76" }, { from: "X84Y76", to: "X84Y80" }, { from: "X84Y80", to: "X84Y84" },
    { from: "X84Y84", to: "X84Y88" }, { from: "X84Y88", to: "X84Y92" }, { from: "X84Y92", to: "X84Y96" },
    { from: "X84Y96", to: "X84Y100" },

    // --- Column X = 88 ---
    { from: "X88Y0", to: "X88Y4" }, { from: "X88Y4", to: "X88Y8" }, { from: "X88Y8", to: "X88Y12" },
    { from: "X88Y12", to: "X88Y16" }, { from: "X88Y16", to: "X88Y20" }, { from: "X88Y20", to: "X88Y24" },
    { from: "X88Y24", to: "X88Y28" }, { from: "X88Y28", to: "X88Y32" }, { from: "X88Y32", to: "X88Y36" },
    { from: "X88Y36", to: "X88Y40" }, { from: "X88Y40", to: "X88Y44" }, { from: "X88Y44", to: "X88Y48" },
    { from: "X88Y48", to: "X88Y52" }, { from: "X88Y52", to: "X88Y56" }, { from: "X88Y56", to: "X88Y60" },
    { from: "X88Y60", to: "X88Y64" }, { from: "X88Y64", to: "X88Y68" }, { from: "X88Y68", to: "X88Y72" },
    { from: "X88Y72", to: "X88Y76" }, { from: "X88Y76", to: "X88Y80" }, { from: "X88Y80", to: "X88Y84" },
    { from: "X88Y84", to: "X88Y88" }, { from: "X88Y88", to: "X88Y92" }, { from: "X88Y92", to: "X88Y96" },
    { from: "X88Y96", to: "X88Y100" },

    // --- Column X = 92 ---
    { from: "X92Y0", to: "X92Y4" }, { from: "X92Y4", to: "X92Y8" }, { from: "X92Y8", to: "X92Y12" },
    { from: "X92Y12", to: "X92Y16" }, { from: "X92Y16", to: "X92Y20" }, { from: "X92Y20", to: "X92Y24" },
    { from: "X92Y24", to: "X92Y28" }, { from: "X92Y28", to: "X92Y32" }, { from: "X92Y32", to: "X92Y36" },
    { from: "X92Y36", to: "X92Y40" }, { from: "X92Y40", to: "X92Y44" }, { from: "X92Y44", to: "X92Y48" },
    { from: "X92Y48", to: "X92Y52" }, { from: "X92Y52", to: "X92Y56" }, { from: "X92Y56", to: "X92Y60" },
    { from: "X92Y60", to: "X92Y64" }, { from: "X92Y64", to: "X92Y68" }, { from: "X92Y68", to: "X92Y72" },
    { from: "X92Y72", to: "X92Y76" }, { from: "X92Y76", to: "X92Y80" }, { from: "X92Y80", to: "X92Y84" },
    { from: "X92Y84", to: "X92Y88" }, { from: "X92Y88", to: "X92Y92" }, { from: "X92Y92", to: "X92Y96" },
    { from: "X92Y96", to: "X92Y100" },

    // --- Column X = 96 ---
    { from: "X96Y0", to: "X96Y4" }, { from: "X96Y4", to: "X96Y8" }, { from: "X96Y8", to: "X96Y12" },
    { from: "X96Y12", to: "X96Y16" }, { from: "X96Y16", to: "X96Y20" }, { from: "X96Y20", to: "X96Y24" },
    { from: "X96Y24", to: "X96Y28" }, { from: "X96Y28", to: "X96Y32" }, { from: "X96Y32", to: "X96Y36" },
    { from: "X96Y36", to: "X96Y40" }, { from: "X96Y40", to: "X96Y44" }, { from: "X96Y44", to: "X96Y48" },
    { from: "X96Y48", to: "X96Y52" }, { from: "X96Y52", to: "X96Y56" }, { from: "X96Y56", to: "X96Y60" },
    { from: "X96Y60", to: "X96Y64" }, { from: "X96Y64", to: "X96Y68" }, { from: "X96Y68", to: "X96Y72" },
    { from: "X96Y72", to: "X96Y76" }, { from: "X96Y76", to: "X96Y80" }, { from: "X96Y80", to: "X96Y84" },
    { from: "X96Y84", to: "X96Y88" }, { from: "X96Y88", to: "X96Y92" }, { from: "X96Y92", to: "X96Y96" },
    { from: "X96Y96", to: "X96Y100" },

    // --- Column X = 100 ---
    { from: "X100Y0", to: "X100Y4" }, { from: "X100Y4", to: "X100Y8" }, { from: "X100Y8", to: "X100Y12" },
    { from: "X100Y12", to: "X100Y16" }, { from: "X100Y16", to: "X100Y20" }, { from: "X100Y20", to: "X100Y24" },
    { from: "X100Y24", to: "X100Y28" }, { from: "X100Y28", to: "X100Y32" }, { from: "X100Y32", to: "X100Y36" },
    { from: "X100Y36", to: "X100Y40" }, { from: "X100Y40", to: "X100Y44" }, { from: "X100Y44", to: "X100Y48" },
    { from: "X100Y48", to: "X100Y52" }, { from: "X100Y52", to: "X100Y56" }, { from: "X100Y56", to: "X100Y60" },
    { from: "X100Y60", to: "X100Y64" }, { from: "X100Y64", to: "X100Y68" }, { from: "X100Y68", to: "X100Y72" },
    { from: "X100Y72", to: "X100Y76" }, { from: "X100Y76", to: "X100Y80" }, { from: "X100Y80", to: "X100Y84" },
    { from: "X100Y84", to: "X100Y88" }, { from: "X100Y88", to: "X100Y92" }, { from: "X100Y92", to: "X100Y96" },
    { from: "X100Y96", to: "X100Y100" },
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
            fontSize="8"
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
