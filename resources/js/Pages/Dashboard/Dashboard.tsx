import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import DashboardExplorer from "./partial/DashboardExplorer";
import DashboardToolPanel from "./partial/DashboardToolPanel";
import { DashboardPage } from "./types";
import DashboardPath from "./partial/DashboardPath";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [selected, setSelected] = useState<number | null>(null);

    const {
        props: { folder_name },
    } = usePage<DashboardPage>();

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
                    <h2 className="text-xl font-semibold">
                        {folder_name ?? "File Manager"}
                    </h2>
                    <DashboardToolPanel selected={selected} />
                </div>
                <DashboardPath />
                <DashboardExplorer setSelected={setSelected} />
            </div>
        </AuthenticatedLayout>
    );
}
