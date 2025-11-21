"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === "dark" ? 0 : 1,
                    rotate: theme === "dark" ? 90 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 left-2"
            >
                <Sun className="h-5 w-5" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    scale: theme === "dark" ? 1 : 0,
                    rotate: theme === "dark" ? 0 : -90,
                }}
                transition={{ duration: 0.2 }}
            >
                <Moon className="h-5 w-5" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
