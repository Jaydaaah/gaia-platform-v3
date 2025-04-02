import ApplicationLogo from "@/Components/ApplicationLogo";
import Avatar from "@/Components/Avatar/Avatar";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ThemeController from "@/Components/ThemeController/ThemeController";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import ToastProvider from "./partial/ToastProvider";

const app_name = import.meta.env.VITE_APP_NAME;

export default function ModalLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;

    return (
        <div className="relative h-screen w-screen bg-background flex justify-center items-center">
            <ToastProvider />

            <nav className="hidden">
                <ThemeController />
            </nav>

            <div
                className="h-screen w-screen bg-black/30"
                onClick={() => window.history.back()}
            ></div>
            <main className="top-20 absolute w-full bg-base-100 max-w-5xl p-5 rounded shadow">
                {children}
            </main>
        </div>
    );
}
