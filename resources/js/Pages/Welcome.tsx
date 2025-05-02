import ThemeController from "@/Components/ThemeController/ThemeController";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

import { FaRobot, FaBook, FaUsers, FaBrain } from "react-icons/fa";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="min-h-screen bg-base-100 text-base-content flex flex-col overflow-x-hidden">
            {/* Navbar */}
            <header className="navbar bg-base-100 shadow">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-primary">GAIA</h1>
                </div>
                <nav className="-mx-3 flex flex-1 justify-end">
                    <ThemeController />
                    {auth.user ? (
                        <Link
                            href={route("dashboard.index")}
                            className="rounded-md px-3 py-2 text-base-content ring-1 ring-transparent transition hover:text-base-content/70 focus:outline-hidden focus-visible:ring-primary"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="rounded-md px-3 py-2 text-base-content ring-1 ring-transparent transition hover:text-base-content/70 focus:outline-hidden focus-visible:ring-primary"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                                className="rounded-md px-3 py-2 text-base-content ring-1 ring-transparent transition hover:text-base-content/70 focus:outline-hidden focus-visible:ring-primary"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Hero Section with Gradient Background */}
            <section className="hero min-h-[70vh] bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold">Welcome to GAIA</h1>
                        <p className="py-6 text-lg">
                            An AI-powered platform revolutionizing how you learn
                            history — smarter, faster, and together.
                        </p>
                        <Link
                            href={
                                auth.user
                                    ? route("dashboard.index")
                                    : route("register")
                            }
                            className="btn btn-secondary"
                        >
                            {auth.user ? "Go to Dashboard" : "Get Started"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6 md:px-20 bg-base-200 text-base-content">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Platform Highlights
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
                    <div className="p-6 bg-base-100 rounded-box shadow">
                        <FaRobot className="text-4xl mx-auto text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">
                            AI Tutoring
                        </h3>
                        <p>
                            Instant help with history questions using smart AI
                            agents.
                        </p>
                    </div>
                    <div className="p-6 bg-base-100 rounded-box shadow">
                        <FaBook className="text-4xl mx-auto text-secondary" />
                        <h3 className="mt-4 text-xl font-semibold">
                            Smart Reviews
                        </h3>
                        <p>
                            Flashcards, quizzes, and timelines — tailored for
                            you.
                        </p>
                    </div>
                    <div className="p-6 bg-base-100 rounded-box shadow">
                        <FaUsers className="text-4xl mx-auto text-accent" />
                        <h3 className="mt-4 text-xl font-semibold">
                            Collaboration
                        </h3>
                        <p>
                            Share notes and discuss with classmates in
                            real-time.
                        </p>
                    </div>
                    <div className="p-6 bg-base-100 rounded-box shadow">
                        <FaBrain className="text-4xl mx-auto text-info" />
                        <h3 className="mt-4 text-xl font-semibold">
                            Adaptive Learning
                        </h3>
                        <p>
                            GAIA learns your style and helps you focus where it
                            matters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-300 text-base-content">
                <aside>
                    <p className="font-semibold">
                        © {new Date().getFullYear()} GAIA Platform
                    </p>
                    <p className="text-sm">
                        Empowering history education with intelligence.
                    </p>
                </aside>
                <nav className="grid grid-flow-col gap-4">
                    <Link href="#" className="link link-hover">
                        Privacy
                    </Link>
                    <Link href="#" className="link link-hover">
                        Terms
                    </Link>
                    <Link href="#" className="link link-hover">
                        Support
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
