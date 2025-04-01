import { useRef } from "react";
import Button from "../../../Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import ModalBox from "@/Components/Modal/ModalBox";
import DashboardCreateFolder from "./DashboardCreateFolder";

interface ToolPanelProps {}
export default function DashboardToolPanel({}: ToolPanelProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <div className="join">
                <Button
                    className="join-item"
                    onClick={() => dialogRef.current?.showModal()}
                >
                    Create Folder
                </Button>
                <Button className="join-item">Delete Folder</Button>
            </div>
            <Modal _ref={dialogRef}>
                <ModalBox className="max-w-sm">
                    <DashboardCreateFolder dialogRef={dialogRef} />
                </ModalBox>
            </Modal>
        </>
    );
}
