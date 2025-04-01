import { FaFolder } from "react-icons/fa";
import FileBase, { FileBaseType } from "./FileBase";

export default function FileFolder({ ...props }: FileBaseType) {
    return (
        <FileBase {...props}>
            <FaFolder size={40} />
        </FileBase>
    );
}
