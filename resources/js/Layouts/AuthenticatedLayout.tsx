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
import GAIALogo from "@/Components/GAIALogo";

const app_name = import.meta.env.VITE_APP_NAME;

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-background">
            <ToastProvider />
            <div className="fixed -z-10 grayscale -bottom-1/2 -right-1/6 opacity-15">
                <GAIALogo className="w-[150vh]" />
            </div>
            <nav className="navbar bg-base-100 shadow-xs">
                <div className="flex-1">
                    <Link
                        href={route("dashboard.index")}
                        as="a"
                        className="btn btn-ghost text-xl"
                    >
                        {app_name} v3
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <a>Link</a>
                        </li>
                        <li>
                            <details>
                                <summary>Parent</summary>
                                <ul className="bg-base-100 rounded-t-none p-2">
                                    <li>
                                        <a>Link 1</a>
                                    </li>
                                    <li>
                                        <a>Link 2</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                    <ThemeController />
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-rounded avatar"
                        >
                            <div className="w-10 rounded-full">
                                <Avatar name={user.name} title={user.name} />
                            </div>
                            {user.name}
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm"
                        >
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </ul>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-base text-base-content">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
