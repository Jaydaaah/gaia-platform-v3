import { Deferred, Link, router, usePage } from "@inertiajs/react";
import { FaFolder, FaFile, FaArrowLeft } from "react-icons/fa";
import { DashboardPage } from "../types";
import Loading from "@/Components/Loading/Loading";
import { Fragment, useCallback, useMemo } from "react";

export default function DashboardPath() {
    const {
        props: { hierarchy },
    } = usePage<DashboardPage>();

    const goBack = useCallback(() => {
        if (Array.isArray(hierarchy) && hierarchy.length > 0) {
            if (hierarchy.length > 1) {
                const target_id = hierarchy[hierarchy.length - 2].id;
                router.visit(route("dashboard.show", target_id));
            } else {
                router.visit(route("dashboard.index"));
            }
        }
    }, [hierarchy]);

    return (
        <div className="mt-4 flex items-center gap-2 text-sm mt">
            <button className="btn btn-sm btn-ghost" onClick={goBack}>
                <FaArrowLeft />
            </button>
            <Deferred
                data={"hierarchy"}
                fallback={
                    <Loading
                        isSpinner={false}
                        className="loading-sm loading-dots"
                    />
                }
            >
                <div className="text-gray-500 flex">
                    {hierarchy && hierarchy.length > 0 ? (
                        hierarchy.map(({ id, name }, index) => (
                            <Fragment key={id}>
                                <span>/</span>
                                <Link
                                    href={route("dashboard.show", id)}
                                    disabled={index + 1 >= hierarchy.length}
                                >
                                    {name}
                                </Link>
                            </Fragment>
                        ))
                    ) : (
                        <span>/</span>
                    )}
                </div>
            </Deferred>
        </div>
    );
}
