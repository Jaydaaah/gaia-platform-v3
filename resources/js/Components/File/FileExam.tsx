import { FaFileAlt } from "react-icons/fa";
import FileBase, { FileBaseType } from "./FileBase";
import { DragEvent, useCallback, useMemo } from "react";

interface FileExamProps {
    exam_file_id: number;
    parent_id: number | null;
}
export default function FileExam({
    exam_file_id: id,
    parent_id,
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
            <FaFileAlt size={40} />
        </FileBase>
    );
}
