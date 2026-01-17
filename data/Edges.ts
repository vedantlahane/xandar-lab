export interface Edge {
    from: string;
    to: string;
}

// ===== PURE RECTANGULAR GRID =====
// All nodes aligned to rows and columns
// Every street is strictly horizontal or vertical


export const EDGES: Edge[] = [
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
    { from: "X24Y16", to: "X28Y16" }, { from: "X28Y16", to: "X32Y16" }, { from: "X32Y16", to: "X36Y16" },
    { from: "X36Y16", to: "X40Y16" }, { from: "X40Y16", to: "X44Y16" }, { from: "X44Y16", to: "X48Y16" },
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
    { from: "X12Y36", to: "X16Y36" }, { from: "X16Y36", to: "X20Y36" }, 
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
    { from: "X12Y40", to: "X16Y40" }, { from: "X16Y40", to: "X20Y40" }, 
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
    // { from: "X12Y44", to: "X16Y44" }, { from: "X16Y44", to: "X20Y44" }, { from: "X20Y44", to: "X24Y44" },
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
    { from: "X12Y48", to: "X16Y48" }, { from: "X16Y48", to: "X20Y48" }, { from: "X20Y48", to: "X24Y48" },
    { from: "X24Y48", to: "X28Y48" }, { from: "X28Y48", to: "X32Y48" }, { from: "X32Y48", to: "X36Y48" },
    // { from: "X36Y48", to: "X40Y48" }, { from: "X40Y48", to: "X44Y48" }, 
    { from: "X44Y48", to: "X48Y48" },
    { from: "X48Y48", to: "X52Y48" }, { from: "X52Y48", to: "X56Y48" }, { from: "X56Y48", to: "X60Y48" },
    { from: "X60Y48", to: "X64Y48" }, { from: "X64Y48", to: "X68Y48" }, { from: "X68Y48", to: "X72Y48" },
    { from: "X72Y48", to: "X76Y48" }, { from: "X76Y48", to: "X80Y48" }, { from: "X80Y48", to: "X84Y48" },
    { from: "X84Y48", to: "X88Y48" }, { from: "X88Y48", to: "X92Y48" }, { from: "X92Y48", to: "X96Y48" },
    { from: "X96Y48", to: "X100Y48" },

    // --- Row Y = 52 ---
    { from: "X0Y52", to: "X4Y52" }, { from: "X4Y52", to: "X8Y52" }, { from: "X8Y52", to: "X12Y52" },
    { from: "X12Y52", to: "X16Y52" }, { from: "X16Y52", to: "X20Y52" }, { from: "X20Y52", to: "X24Y52" },
    // { from: "X24Y52", to: "X28Y52" }, { from: "X28Y52", to: "X32Y52" }, { from: "X32Y52", to: "X36Y52" },
    { from: "X36Y52", to: "X40Y52" }, { from: "X40Y52", to: "X44Y52" }, { from: "X44Y52", to: "X48Y52" },
    { from: "X48Y52", to: "X52Y52" }, { from: "X52Y52", to: "X56Y52" }, { from: "X56Y52", to: "X60Y52" },
    { from: "X60Y52", to: "X64Y52" }, { from: "X64Y52", to: "X68Y52" }, { from: "X68Y52", to: "X72Y52" },
    { from: "X72Y52", to: "X76Y52" }, { from: "X76Y52", to: "X80Y52" }, { from: "X80Y52", to: "X84Y52" },
    { from: "X84Y52", to: "X88Y52" }, { from: "X88Y52", to: "X92Y52" }, { from: "X92Y52", to: "X96Y52" },
    { from: "X96Y52", to: "X100Y52" },

    // --- Row Y = 56 ---
    { from: "X0Y56", to: "X4Y56" }, { from: "X4Y56", to: "X8Y56" }, { from: "X8Y56", to: "X12Y56" },
    { from: "X12Y56", to: "X16Y56" }, { from: "X16Y56", to: "X20Y56" }, { from: "X20Y56", to: "X24Y56" },
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
    { from: "X16Y36", to: "X16Y40" }, { from: "X16Y40", to: "X16Y44" }, { from: "X16Y44", to: "X16Y48" },
    { from: "X16Y48", to: "X16Y52" }, { from: "X16Y52", to: "X16Y56" }, { from: "X16Y56", to: "X16Y60" },
    { from: "X16Y60", to: "X16Y64" }, { from: "X16Y64", to: "X16Y68" }, { from: "X16Y68", to: "X16Y72" },
    { from: "X16Y72", to: "X16Y76" }, { from: "X16Y76", to: "X16Y80" }, { from: "X16Y80", to: "X16Y84" },
    { from: "X16Y84", to: "X16Y88" }, { from: "X16Y88", to: "X16Y92" }, { from: "X16Y92", to: "X16Y96" },
    { from: "X16Y96", to: "X16Y100" },

    // --- Column X = 20 ---
    { from: "X20Y0", to: "X20Y4" }, { from: "X20Y4", to: "X20Y8" }, { from: "X20Y8", to: "X20Y12" },
    { from: "X20Y12", to: "X20Y16" }, { from: "X20Y16", to: "X20Y20" }, { from: "X20Y20", to: "X20Y24" },
    { from: "X20Y24", to: "X20Y28" }, { from: "X20Y28", to: "X20Y32" }, { from: "X20Y32", to: "X20Y36" },
    { from: "X20Y36", to: "X20Y40" }, { from: "X20Y40", to: "X20Y44" }, { from: "X20Y44", to: "X20Y48" },
    { from: "X20Y48", to: "X20Y52" }, { from: "X20Y52", to: "X20Y56" }, { from: "X20Y56", to: "X20Y60" },
    { from: "X20Y60", to: "X20Y64" }, { from: "X20Y64", to: "X20Y68" }, { from: "X20Y68", to: "X20Y72" },
    { from: "X20Y72", to: "X20Y76" }, { from: "X20Y76", to: "X20Y80" }, { from: "X20Y80", to: "X20Y84" },
    { from: "X20Y84", to: "X20Y88" }, { from: "X20Y88", to: "X20Y92" }, { from: "X20Y92", to: "X20Y96" },
    { from: "X20Y96", to: "X20Y100" },

    // --- Column X = 24 ---
    { from: "X24Y0", to: "X24Y4" }, { from: "X24Y4", to: "X24Y8" }, { from: "X24Y8", to: "X24Y12" },
    { from: "X24Y12", to: "X24Y16" }, { from: "X24Y16", to: "X24Y20" }, { from: "X24Y20", to: "X24Y24" },
    { from: "X24Y24", to: "X24Y28" }, { from: "X24Y28", to: "X24Y32" }, { from: "X24Y32", to: "X24Y36" },
    { from: "X24Y36", to: "X24Y40" }, { from: "X24Y40", to: "X24Y44" }, 
    // { from: "X24Y44", to: "X24Y48" },
    //{ from: "X24Y48", to: "X24Y52" }, { from: "X24Y52", to: "X24Y56" }, { from: "X24Y56", to: "X24Y60" },
    { from: "X24Y60", to: "X24Y64" }, { from: "X24Y64", to: "X24Y68" }, { from: "X24Y68", to: "X24Y72" },
    { from: "X24Y72", to: "X24Y76" }, { from: "X24Y76", to: "X24Y80" }, { from: "X24Y80", to: "X24Y84" },
    { from: "X24Y84", to: "X24Y88" }, { from: "X24Y88", to: "X24Y92" }, { from: "X24Y92", to: "X24Y96" },
    { from: "X24Y96", to: "X24Y100" },

    // --- Column X = 28 ---
    { from: "X28Y0", to: "X28Y4" }, { from: "X28Y4", to: "X28Y8" }, { from: "X28Y8", to: "X28Y12" },
    { from: "X28Y12", to: "X28Y16" }, { from: "X28Y16", to: "X28Y20" }, { from: "X28Y20", to: "X28Y24" },
    { from: "X28Y24", to: "X28Y28" }, { from: "X28Y28", to: "X28Y32" }, { from: "X28Y32", to: "X28Y36" },
    { from: "X28Y36", to: "X28Y40" }, { from: "X28Y40", to: "X28Y44" }, { from: "X28Y44", to: "X28Y48" },
    { from: "X28Y48", to: "X28Y52" }, { from: "X28Y52", to: "X28Y56" }, { from: "X28Y56", to: "X28Y60" },
    { from: "X28Y60", to: "X28Y64" }, { from: "X28Y64", to: "X28Y68" }, { from: "X28Y68", to: "X28Y72" },
    { from: "X28Y72", to: "X28Y76" }, { from: "X28Y76", to: "X28Y80" }, { from: "X28Y80", to: "X28Y84" },
    { from: "X28Y84", to: "X28Y88" }, { from: "X28Y88", to: "X28Y92" }, { from: "X28Y92", to: "X28Y96" },
    { from: "X28Y96", to: "X28Y100" },

    // --- Column X = 32 ---
    { from: "X32Y0", to: "X32Y4" }, { from: "X32Y4", to: "X32Y8" }, { from: "X32Y8", to: "X32Y12" },
    { from: "X32Y12", to: "X32Y16" }, { from: "X32Y16", to: "X32Y20" }, { from: "X32Y20", to: "X32Y24" },
    { from: "X32Y24", to: "X32Y28" }, { from: "X32Y28", to: "X32Y32" }, { from: "X32Y32", to: "X32Y36" },
    { from: "X32Y36", to: "X32Y40" }, { from: "X32Y40", to: "X32Y44" }, { from: "X32Y44", to: "X32Y48" },
    { from: "X32Y48", to: "X32Y52" }, { from: "X32Y52", to: "X32Y56" }, { from: "X32Y56", to: "X32Y60" },
    { from: "X32Y60", to: "X32Y64" }, { from: "X32Y64", to: "X32Y68" }, { from: "X32Y68", to: "X32Y72" },
    { from: "X32Y72", to: "X32Y76" }, { from: "X32Y76", to: "X32Y80" }, { from: "X32Y80", to: "X32Y84" },
    { from: "X32Y84", to: "X32Y88" }, { from: "X32Y88", to: "X32Y92" }, { from: "X32Y92", to: "X32Y96" },
    { from: "X32Y96", to: "X32Y100" },

    // --- Column X = 36 ---
    { from: "X36Y0", to: "X36Y4" }, { from: "X36Y4", to: "X36Y8" }, { from: "X36Y8", to: "X36Y12" },
    { from: "X36Y12", to: "X36Y16" },
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
     { from: "X44Y20", to: "X44Y24" },
    { from: "X44Y24", to: "X44Y28" }, { from: "X44Y28", to: "X44Y32" }, { from: "X44Y32", to: "X44Y36" },
    { from: "X44Y36", to: "X44Y40" }, { from: "X44Y40", to: "X44Y44" }, { from: "X44Y44", to: "X44Y48" },
    { from: "X44Y48", to: "X44Y52" }, { from: "X44Y52", to: "X44Y56" }, { from: "X44Y56", to: "X44Y60" },
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