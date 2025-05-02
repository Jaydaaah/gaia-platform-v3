import { IoIosShareAlt } from "react-icons/io";
import { TbShare3 } from "react-icons/tb";
import { FaFileAlt } from "react-icons/fa";
import FileBase, { FileBaseType } from "./FileBase";
import { DragEvent, useCallback, useMemo } from "react";

interface FileExamProps {
    exam_file_id: number;
    parent_id: number | null;
    isShared?: boolean;
}
export default function FileExam({
    exam_file_id: id,
    parent_id,
    isShared = false,
    ...props
}: FileExamProps & FileBaseType) {
    const dataStored = useMemo(() => {
        const data = {
            type: "examfile",
            id,
            parent_id,
        };
        return JSON.stringify(data);
    }, [id, parent_id]);

    const onDragStart = useCallback(
        ({ dataTransfer }: DragEvent<HTMLDivElement>) => {
            dataTransfer.setData("application/json", dataStored);
            dataTransfer.effectAllowed = "move";
        },
        [dataStored]
    );

    return (
        <FileBase draggable onDragStart={onDragStart} {...props}>
            {isShared && (
                <span className="absolute top-2 right-2" title={"This file is shared to you"}>
                    <IoIosShareAlt />
                </span>
            )}
            <FaFileAlt
                className={`${isShared ? "opacity-50" : ""}`}
                size={40}
            />
        </FileBase>
    );
}
