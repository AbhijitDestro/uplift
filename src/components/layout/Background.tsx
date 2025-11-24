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
            <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500 bg-[#f7eaff]">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                  radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
                  radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
                  radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
                  radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
                  linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
                `,
                    }}
                />
            </div>
        </div>
    );
}
