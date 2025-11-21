"use client";

import * as React from "react";

export function Background() {
    return (
        <div className="fixed inset-0 -z-50 h-full w-full">
            {/* Dark Theme Background */}
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-black">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
            `,
                    }}
                />
            </div>

            {/* Light Theme Background */}
            <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500 bg-[#f5f5dc]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(180deg, 
                rgba(245,245,220,1) 0%, 
                rgba(255,223,186,0.8) 25%, 
                rgba(255,182,193,0.6) 50%, 
                rgba(147,112,219,0.7) 75%, 
                rgba(72,61,139,0.9) 100%
              ),
              radial-gradient(circle at 30% 20%, rgba(255,255,224,0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(72,61,139,0.6) 0%, transparent 70%),
              radial-gradient(circle at 50% 60%, rgba(147,112,219,0.3) 0%, transparent 60%)
            `,
                    }}
                />
            </div>
        </div>
    );
}
