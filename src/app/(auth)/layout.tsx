import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Background } from "@/components/layout/Background";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
            <Background />
            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Uplift</span>
                </Link>
            </div>
            <div className="w-full max-w-md px-4 relative z-10">
                {children}
            </div>
        </div>
    );
}
