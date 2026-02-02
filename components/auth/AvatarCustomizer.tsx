"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Available avatar gradient colors
const AVATAR_GRADIENTS = [
    { id: "teal", from: "from-teal-400", to: "to-emerald-500", label: "Teal" },
    { id: "violet", from: "from-violet-400", to: "to-purple-500", label: "Violet" },
    { id: "blue", from: "from-blue-400", to: "to-cyan-500", label: "Blue" },
    { id: "amber", from: "from-amber-400", to: "to-orange-500", label: "Amber" },
    { id: "rose", from: "from-rose-400", to: "to-pink-500", label: "Rose" },
    { id: "indigo", from: "from-indigo-400", to: "to-blue-500", label: "Indigo" },
    { id: "emerald", from: "from-emerald-400", to: "to-teal-500", label: "Emerald" },
    { id: "fuchsia", from: "from-fuchsia-400", to: "to-pink-500", label: "Fuchsia" },
];

// Get gradient class from ID
export function getAvatarGradientClass(gradientId: string | undefined): string {
    const gradient = AVATAR_GRADIENTS.find(g => g.id === gradientId);
    if (gradient) {
        return `${gradient.from} ${gradient.to}`;
    }
    // Default gradient based on first character if no ID
    return "from-zinc-400 to-zinc-500";
}

// Get gradient by username (fallback)
export function getDefaultAvatarGradient(username: string): string {
    const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index].id;
}

interface AvatarCustomizerProps {
    username: string;
    currentGradient?: string;
    onSave: (gradientId: string) => Promise<void>;
}

export function AvatarCustomizer({ username, currentGradient, onSave }: AvatarCustomizerProps) {
    const [selected, setSelected] = useState(currentGradient || getDefaultAvatarGradient(username));
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(selected);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save avatar:", error);
        } finally {
            setSaving(false);
        }
    };

    const hasChanged = selected !== (currentGradient || getDefaultAvatarGradient(username));

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="flex items-center gap-4">
                <motion.div
                    key={selected}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "h-20 w-20 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white uppercase shadow-lg",
                        getAvatarGradientClass(selected)
                    )}
                >
                    {username.charAt(0)}
                </motion.div>
                <div>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {username}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Choose your avatar color
                    </p>
                </div>
            </div>

            {/* Color options */}
            <div className="grid grid-cols-4 gap-2">
                {AVATAR_GRADIENTS.map((gradient, index) => (
                    <motion.button
                        key={gradient.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelected(gradient.id)}
                        className={cn(
                            "relative h-12 rounded-lg bg-gradient-to-br transition-all duration-200",
                            gradient.from, gradient.to,
                            selected === gradient.id
                                ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 dark:ring-offset-zinc-900"
                                : "hover:scale-105"
                        )}
                        title={gradient.label}
                    >
                        {selected === gradient.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Check className="h-5 w-5 text-white" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Save button */}
            {hasChanged && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            "Save Avatar"
                        )}
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
