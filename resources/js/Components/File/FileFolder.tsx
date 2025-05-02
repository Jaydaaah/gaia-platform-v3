import { FaFolder } from "react-icons/fa";
import FileBase, { FileBaseType } from "./FileBase";
import { DragEvent, useCallback, useMemo } from "react";
import { router } from "@inertiajs/react";

interface FileFolderProps {
    folder_id: number;
    parent_id: number | null;
}
export default function FileFolder({
    folder_id,
    parent_id,
    ...props
}: FileFolderProps & FileBaseType) {
    const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        const { types } = event.dataTransfer;
        if (types.includes("application/json")) {
            event.preventDefault();
        }
    }, []);

    const onDrop = useCallback(
        ({ dataTransfer }: DragEvent<HTMLDivElement>) => {
            const data = dataTransfer.getData("application/json");
            if (typeof data == "string") {
                const item: {
                    type: string;
                    id: number;
                    parent_id: number | null;
                } = JSON.parse(data);
                if (item && typeof item.id == "number") {
                    if (item.type == "examfile" || item.type == "folder") {
                        const {
                            type,
                            id: dashboard,
                            parent_id: origin_folder_id,
                        } = item;
                        router.patch(route("dashboard.update", dashboard), {
                            type,
                            origin_folder_id,
                            target_folder_id: folder_id,
                        });
                    }
                }
            }
        },
        [folder_id]
    );

    const dataStored = useMemo(() => {
        const data = {
            type: "folder",
            id: folder_id,
            parent_id,
        };
        return JSON.stringify(data);
    }, [folder_id]);

    const onDragStart = useCallback(
        ({ dataTransfer }: DragEvent<HTMLDivElement>) => {
            dataTransfer.setData("application/json", dataStored);
            dataTransfer.effectAllowed = "move";
        },
        [dataStored]
    );

    return (
        <FileBase
            {...props}
            draggable
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragStart={onDragStart}
        >
            <FaFolder size={40} />
        </FileBase>
    );
}
