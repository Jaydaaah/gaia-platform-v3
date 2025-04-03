import { BsFillTrashFill } from "react-icons/bs";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import ModalBox from "@/Components/Modal/ModalBox";
import DashboardCreateFolder from "./DashboardCreateFolder";
import { useSwal } from "@/Hook/SweetAlert/useSwal";
import { router } from "@inertiajs/react";

type ToolPanelProps = {
    selected: {
        dashboard: number;
        type: "folder" | "examfile";
    } | null;
};
export default function DashboardToolPanel({ selected }: ToolPanelProps) {
    const [deleteThis, setDeleteThis] = useState<
        {
            dashboard: number;
            type: "folder" | "examfile";
        }[]
    >([]);

    const swal = useSwal();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        deleteThis.forEach((item) => {
            router.delete(route("dashboard.destroy", item), {
                onSuccess: () => {
                    setDeleteThis((prev) =>
                        prev.filter(({ dashboard }) => dashboard != item.dashboard)
                    );
                },
            });
        });
    }, [deleteThis]);

    const deleteClick = useCallback(() => {
        if (!!swal) {
            swal.fire({
                title: "Are you sure, you want to delete this item?",
                text: "You can always recover this",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then(({ isConfirmed }) => {
                if (isConfirmed && selected) {
                    setDeleteThis((prev) => [...prev, selected]);
                }
            });
        }
    }, [swal, selected]);

    return (
        <>
            <div className="join">
                <Button
                    className="join-item"
                    onClick={() => dialogRef.current?.showModal()}
                >
                    Create Folder
                </Button>
                <Button
                    className="join-item"
                    disabled={!selected}
                    onClick={deleteClick}
                >
                    Delete Folder
                    <BsFillTrashFill />
                </Button>
            </div>
            <Modal _ref={dialogRef}>
                <ModalBox className="max-w-sm">
                    <DashboardCreateFolder dialogRef={dialogRef} />
                </ModalBox>
            </Modal>
        </>
    );
}
