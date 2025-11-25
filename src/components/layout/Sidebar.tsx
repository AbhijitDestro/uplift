"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    PenTool,
    MessageSquare,
    Video,
    Mic,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Resume Analyzer", href: "/resume/analyzer" },
    { icon: PenTool, label: "Resume Builder", href: "/resume/builder" },
    { icon: MessageSquare, label: "Cover Letter", href: "/cover-letter" },
    { icon: Video, label: "Practice Interviews", href: "/practice-interviews" },
    { icon: TrendingUp, label: "Industry Insights", href: "/industry-insights" },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isOpen = false, onClose, onCollapseChange }: SidebarProps = {}) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = React.useState<{ top: number; left: number } | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapseChange?.(newState);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 240 }}
                animate={{ width: isCollapsed ? 80 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 h-screen bg-background/80 backdrop-blur-md border-r border-border hidden md:flex flex-col z-40"
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                    <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-bold text-xl tracking-tight whitespace-nowrap"
                                >
                                    Uplift
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={handleToggleCollapse}
                    className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 hover:bg-accent transition-colors z-50"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onMouseEnter={(e) => {
                                    if (!isCollapsed) return;
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setHoveredItem(item.href);
                                    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right });
                                }}
                                onMouseLeave={() => {
                                    setHoveredItem(null);
                                    setTooltipPos(null);
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-3 border-t border-border/50 space-y-1">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                        <Settings className="h-5 w-5 shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <LogOut className="h-5 w-5 shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    Log out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col z-50 md:hidden"
                        >
                            {/* Logo Section */}
                            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                                <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight">Uplift</span>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Bottom Section */}
                            <div className="p-3 border-t border-border/50 space-y-1">
                                <Link
                                    href="/settings"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                >
                                    <Settings className="h-5 w-5 shrink-0" />
                                    <span>Settings</span>
                                </Link>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                                    <LogOut className="h-5 w-5 shrink-0" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Tooltip Portal */}
            {mounted && isCollapsed && hoveredItem && tooltipPos && createPortal(
                <div
                    className="fixed px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md z-50 pointer-events-none whitespace-nowrap"
                    style={{
                        top: tooltipPos.top,
                        left: tooltipPos.left + 10,
                        transform: 'translateY(-50%)'
                    }}
                >
                    {menuItems.find(i => i.href === hoveredItem)?.label}
                </div>,
                document.body
            )}
        </>
    );
}
