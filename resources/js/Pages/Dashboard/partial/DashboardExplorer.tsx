import FileFolder from "@/Components/File/FileFolder";
import Loading from "@/Components/Loading/Loading";
import { Folder } from "@/types/Models";
import { Deferred, usePage } from "@inertiajs/react";
import { useMemo } from "react";

export default function DashboardExplorer() {
    const {
        props: { folders },
    } = usePage();

    const folderItems = useMemo(() => {
        if (Array.isArray(folders)) {
            const items: Folder[] = [...folders];
            return items;
        }
        const items: Folder[] = [];
        return items;
    }, [folders]);

    return (
        <div>
            <Deferred
                data={["folders"]}
                fallback={
                    <div className="flex items-center justify-center py-10">
                        <Loading className="text-info loading-lg" />
                    </div>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {folderItems.map(({ id, name }) => (
                        <FileFolder key={id} title={name} />
                    ))}
                </div>
            </Deferred>
        </div>
    );
}
