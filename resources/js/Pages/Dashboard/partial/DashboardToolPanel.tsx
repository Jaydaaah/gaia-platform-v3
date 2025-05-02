import { BsFillTrashFill } from "react-icons/bs";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import ModalBox from "@/Components/Modal/ModalBox";
import DashboardCreateFolder from "./DashboardCreateFolder";
import { useSwal } from "@/Hook/SweetAlert/useSwal";
import { router, usePage } from "@inertiajs/react";
import { DashboardPage } from "../types";

type ToolPanelProps = {
    selected: {
        dashboard: number;
        type: "folder" | "examfile";
    } | null;
};
export default function DashboardToolPanel({ selected }: ToolPanelProps) {
    const {
        props: { folder_id, parent_id },
    } = usePage<DashboardPage>();

    const [deleteThis, setDeleteThis] = useState<
        {
            dashboard: number;
            type: "folder" | "examfile";
        }[]
    >([]);
    const [moveThis, setMoveThis] = useState<
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
                        prev.filter(
                            ({ dashboard }) => dashboard != item.dashboard
                        )
                    );
                },
            });
        });
    }, [deleteThis]);

    useEffect(() => {
        moveThis.forEach(({ dashboard, type }) => {
            if (folder_id != parent_id) {
                router.patch(
                    route("dashboard.update", dashboard),
                    {
                        type,
                        origin_folder_id: folder_id,
                        target_folder_id: parent_id,
                    },
                    {
                        onSuccess: () => {
                            setMoveThis((prev) =>
                                prev.filter(
                                    (item) => item.dashboard != dashboard
                                )
                            );
                        },
                    }
                );
            }
        });
    }, [moveThis, folder_id, parent_id]);

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

    const moveClick = useCallback(() => {
        if (selected) {
            setMoveThis((prev) => [...prev, selected]);
        }
    }, [selected]);

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
                    Delete
                    <BsFillTrashFill />
                </Button>
                {!!folder_id && (
                    <Button
                        className="join-item"
                        disabled={!selected}
                        onClick={moveClick}
                    >
                        Move Outside
                    </Button>
                )}
            </div>
            <Modal _ref={dialogRef}>
                <ModalBox className="max-w-sm">
                    <DashboardCreateFolder dialogRef={dialogRef} />
                </ModalBox>
            </Modal>
        </>
    );
}
