import FileFolder from "@/Components/File/FileFolder";
import Loading from "@/Components/Loading/Loading";
import { Folder } from "@/types/Models";
import { Deferred, router, usePage } from "@inertiajs/react";
import {
    Dispatch,
    FocusEvent,
    SetStateAction,
    useCallback,
    useMemo,
} from "react";
import { DashboardPage } from "../types";
import FileExam from "@/Components/File/FileExam";

type DashboardExplorerProps = {
    setSelected: Dispatch<
        SetStateAction<{
            dashboard: number;
            type: "folder" | "examfile";
        } | null>
    >;
};
export default function DashboardExplorer({
    setSelected,
}: DashboardExplorerProps) {
    const {
        props: {
            folders,
            files,
            folder_id,
            auth: { user },
        },
    } = usePage<DashboardPage>();

    const folderItems = useMemo(() => {
        return folders ?? [];
    }, [folders]);

    const fileItems = useMemo(() => {
        return files ?? [];
    }, [files]);

    const onFocus = useCallback(
        (dashboard: number, type: "examfile" | "folder") => {
            return ({ target }: FocusEvent<HTMLDivElement>) => {
                setSelected({ dashboard, type });
            };
        },
        []
    );

    const onBlur = useCallback(
        (dashboard: number, type: "examfile" | "folder") => {
            return ({ target }: FocusEvent<HTMLDivElement>) => {
                setTimeout(
                    () =>
                        setSelected((prev) => {
                            if (
                                prev &&
                                prev.dashboard == dashboard &&
                                prev.type == type
                            ) {
                                return null;
                            }
                            return prev;
                        }),
                    300
                );
            };
        },
        []
    );

    return (
        <div className="">
            <Deferred
                data={["folders", "files"]}
                fallback={
                    <div className="flex items-center justify-center py-10">
                        <Loading className="text-info loading-lg" />
                    </div>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {folderItems.map(({ id, name }) => (
                        <FileFolder
                            parent_id={folder_id}
                            folder_id={id}
                            key={id}
                            title={name}
                            onFocus={onFocus(id, "folder")}
                            onBlur={onBlur(id, "folder")}
                            onDoubleClick={() => {
                                router.visit(route("dashboard.show", id));
                            }}
                        />
                    ))}
                    {fileItems.map(({ id, name, owner_id }) => (
                        <FileExam
                            exam_file_id={id}
                            parent_id={folder_id}
                            key={id}
                            title={name}
                            isShared={owner_id != user.id}
                            onFocus={onFocus(id, "examfile")}
                            onBlur={onBlur(id, "examfile")}
                            onDoubleClick={() => {
                                router.visit(route("chat.show", id));
                            }}
                        />
                    ))}
                </div>
            </Deferred>
        </div>
    );
}
