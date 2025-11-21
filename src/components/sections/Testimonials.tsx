"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Software Engineer at Google",
        image: "https://i.pravatar.cc/150?u=sarah",
        content:
            "The AI resume builder helped me highlight my skills perfectly. I got more callbacks in one week than I did in three months!",
    },
    {
        name: "Michael Chen",
        role: "Product Manager at Microsoft",
        image: "https://i.pravatar.cc/150?u=michael",
        content:
            "Mock interviews were a game changer. The feedback was so detailed and specific, I felt completely prepared for the real thing.",
    },
    {
        name: "Emily Davis",
        role: "UX Designer at Airbnb",
        image: "https://i.pravatar.cc/150?u=emily",
        content:
            "I love the cover letter generator. It saved me hours of writing and sounded exactly like me, but more professional.",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Loved by Job Seekers
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of professionals who have accelerated their careers
                        with our AI tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-secondary/20 border border-border backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-6">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
