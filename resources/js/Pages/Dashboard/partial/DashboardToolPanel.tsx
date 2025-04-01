import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import ModalBox from "@/Components/Modal/ModalBox";
import DashboardCreateFolder from "./DashboardCreateFolder";
import { useSwal } from "@/Hook/SweetAlert/useSwal";
import { router } from "@inertiajs/react";

type ToolPanelProps = {
    selected: number | null;
};
export default function DashboardToolPanel({ selected }: ToolPanelProps) {
    const [deleteThis, setDeleteThis] = useState<number[]>([]);
    const [tobeDeleted, setTobeDeleted] = useState<number | null>(null);

    const swal = useSwal();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        deleteThis.forEach((id) => {
            router.delete(route("dashboard.destroy", id), {
                onSuccess: () => {
                    setDeleteThis((prev) =>
                        prev.filter((prev_id) => prev_id != id)
                    );
                },
            });
        });
    }, [deleteThis]);

    const deleteClick = useCallback(() => {
        if (!!swal) {
            setTobeDeleted(selected);
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
                } else {
                    setTobeDeleted(null);
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
                    disabled={!selected && !tobeDeleted}
                    onClick={deleteClick}
                >
                    Delete Folder
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
