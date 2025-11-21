import * as React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background/20 backdrop-blur-sm border-t border-border py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Uplift</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering job seekers with AI tools to build careers they love.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Resume Builder
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Cover Letter
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Mock Interview
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Uplift. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
