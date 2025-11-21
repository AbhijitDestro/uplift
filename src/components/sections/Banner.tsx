"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Banner() {
    return (
        <section className="py-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative w-full aspect-21/9 rounded-2xl overflow-hidden shadow-2xl border border-border/50"
            >
                <Image
                    src="/images/banner.jpg"
                    alt="AI Career Coach Dashboard"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
            </motion.div>
        </section>
    );
}
