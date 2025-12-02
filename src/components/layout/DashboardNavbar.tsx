"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/app/actions/profile";

export function DashboardNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [userImage, setUserImage] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchUserImage() {
            if (session?.user?.id) {
                const data = await getUserProfile();
                if (data?.image) {
                    setUserImage(data.image);
                }
            }
        }
        fetchUserImage();

        const handleProfileUpdate = () => {
            fetchUserImage();
        };

        window.addEventListener("profile-updated", handleProfileUpdate);

        return () => {
            window.removeEventListener("profile-updated", handleProfileUpdate);
        };
    }, [session]);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <header className="h-16 border-b border-white/10 bg-background/30 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="relative hidden sm:block max-w-md w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-full border border-white/10 bg-background/30 backdrop-blur-xl pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* User Avatar Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-medium text-sm ring-2 ring-background shadow-sm overflow-hidden">
                            {userImage ? (
                                <img src={userImage} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                session?.user?.name?.charAt(0).toUpperCase() || "U"
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />

                                {/* Dropdown Menu */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 bg-background border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                                >
                                    <div className="p-2 relative z-10">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}