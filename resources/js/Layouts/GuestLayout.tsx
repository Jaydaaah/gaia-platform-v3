import GAIALogo from "@/Components/GAIALogo";
import ThemeController from "@/Components/ThemeController/ThemeController";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-base-200 pt-6 sm:justify-center sm:pt-0 overflow-hidden">
            <div className="sm:hidden fixed w-screen h-screen bg-base-300 z-50 flex justify-center items-center">
                Sorry but, Mobile version is not supported yet
            </div>
            {/* Theme Toggle Top Right */}
            <div className="absolute top-4 left-5">
                <ThemeController />
            </div>

            {/* Logo */}
            <div>
                <Link href="/">
                    <GAIALogo className="h-48 w-48 fill-current text-primary" />
                </Link>
            </div>

            {/* Auth Card */}
            <div className="mt-6 w-full overflow-hidden bg-base-100 px-6 py-4 shadow-xl sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
