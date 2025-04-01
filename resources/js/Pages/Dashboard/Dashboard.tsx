import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { FaFolder, FaFile, FaArrowLeft } from "react-icons/fa";
import DashboardExplorer from "./partial/DashboardExplorer";
import DashboardToolPanel from "./partial/DashboardToolPanel";

const files = [
    { name: "Documents", type: "folder" },
    { name: "Images", type: "folder" },
    { name: "Notes.txt", type: "file" },
    { name: "Presentation.pptx", type: "file" },
    { name: "Documents", type: "folder" },
    { name: "Images", type: "folder" },
    { name: "Notes.txt", type: "file" },
];

export default function Dashboard() {
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-6 sm:max-w-4xl sm:mx-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">File Manager</h2>
                    <DashboardToolPanel />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm mt">
                    {currentPath.length > 0 && (
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setCurrentPath([])}
                        >
                            <FaArrowLeft />
                        </button>
                    )}
                    <span className="text-gray-500">
                        /{currentPath.join("/")}
                    </span>
                </div>
                <DashboardExplorer />
            </div>
        </AuthenticatedLayout>
    );
}
