import { FaFileAlt } from "react-icons/fa";
import FileBase, { FileBaseType } from "./FileBase";

export default function FileExam({ ...props }: FileBaseType) {
    return (
        <FileBase {...props}>
            <FaFileAlt size={40} />
        </FileBase>
    );
}
