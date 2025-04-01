import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect, useMemo, useRef } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function ToastProvider() {
    const { props } = usePage<
        PageProps<{
            toast?: {
                requestId: number;
                type: "default" | "error" | "success" | "info" | "warning";
                message: string;
            };
        }>
    >();

    const { toast: toast_data } = props;

    const requestIds = useRef<number[]>([]);

    useEffect(() => {
        if (!!toast_data) {
            const { requestId, type, message } = toast_data;
            if (requestIds.current?.includes(requestId) == false) {
                toast(message, {
                    type,
                });
                requestIds.current?.push(requestId);
            }
        }
    }, [toast_data]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />
    );
}
