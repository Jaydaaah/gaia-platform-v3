import { PageProps, User } from "@/types";
import { ExamFile } from "@/types/Models";
import { Deferred, router, usePage } from "@inertiajs/react";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import { useCallback, useEffect, useMemo } from "react";
import { useSwal } from "@/Hook/SweetAlert/useSwal";
import echo from "@/echo";
import { toast } from "react-toastify";

export default function SharedToYou() {
    const swal = useSwal();

    const {
        props: {
            shared_to_you,
            auth: { user },
        },
    } = usePage<
        PageProps<{
            shared_to_you?: ExamFile[];
        }>
    >();

    const loading = useMemo(() => {
        return shared_to_you == undefined;
    }, [shared_to_you]);

    const count = useMemo(() => {
        return shared_to_you?.length ?? 0;
    }, [shared_to_you]);

    const acceptClick = useCallback((exam_file_id: number) => {
        return () => {
            router.post(route("examfile.accept"), {
                exam_file_id,
            });
        };
    }, []);
    const deleteClick = useCallback((exam_file_id: number) => {
        return () => {
            if (!!swal) {
                swal.fire({
                    title: "Are you sure, you want to remove this item?",
                    text: "You can always recover this",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Yes, remove it!",
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        router.delete(route("examfile.destroy", exam_file_id));
                    }
                });
            }
        };
    }, []);

    useEffect(() => {
        const channel = echo.private(`App.Models.User.${user.id}`);
        channel.listen(
            ".invited.user",
            ({ from_user }: { from_user: User }) => {
                if (from_user) {
                    const message = `${from_user.name} has shared you an item. You can check it at the dropdown`;
                    toast(message, {
                        type: "default",
                    });
                    router.reload({ only: ["shared_to_you"] });
                }
            }
        );
        return () => {
            channel.stopListening(".invited.user");
        };
    }, [user]);

    return (
        <div className="dropdown">
            <div
                tabIndex={0}
                role="button"
                className={`btn btn-ghost m-1 ${
                    loading ? "animate-pulse" : ""
                }`}
            >
                Shared to You
                <Badge className="badge-accent">{count}</Badge>
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 rounded-box z-1 max-w-sm p-2 shadow-2xl min-h-12 max-h-96 overflow-x-hidden overflow-y-auto"
            >
                <Deferred
                    data={"shared_to_you"}
                    fallback={
                        <div className="flex justify-center">
                            <Loading />
                        </div>
                    }
                >
                    <>
                        {shared_to_you?.length ? (
                            shared_to_you.map(({ id, name }) => (
                                <div
                                    key={id}
                                    className="flex items-center gap-5"
                                >
                                    <div className="join">
                                        <Button
                                            className="join-item flex-shrink-0 btn-sm"
                                            onClick={acceptClick(id)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            className="join-item flex-shrink-0 btn-sm"
                                            onClick={deleteClick(id)}
                                        >
                                            <span className="text-error text-muted">
                                                Remove
                                            </span>
                                        </Button>
                                    </div>
                                    <span className="truncate  text-sm">
                                        {name}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-full w-64">
                                <span className="text-sm">No Item</span>
                            </div>
                        )}
                    </>
                </Deferred>
            </ul>
        </div>
    );
}
