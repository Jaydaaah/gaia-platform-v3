import ToolPanel from "@/Components/Dashboard/ToolPanel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { FaFolder, FaFile, FaArrowLeft } from "react-icons/fa";

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

    const { props } = usePage();

    console.log("props: ", props);

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
                    <ToolPanel
                        createOnClick={() => {}}
                        deleteOnClick={() => {}}
                    />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {files.map((item, index) => (
                        <button
                            key={index}
                            className="p-4 bg-base-200 rounded-lg shadow hover:bg-base-300 flex flex-col items-center justify-center"
                            onClick={() =>
                                item.type === "folder" &&
                                setCurrentPath([...currentPath, item.name])
                            }
                        >
                            {item.type === "folder" ? (
                                <FaFolder size={40} />
                            ) : (
                                <FaFile size={40} />
                            )}
                            <span className="mt-2 text-sm font-medium">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
