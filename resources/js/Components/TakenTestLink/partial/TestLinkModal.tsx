import { useRef } from "react";

interface TestLinkModalProps {
    label: string;
    src: string;
    isSmall?: boolean;
}
export default function TestLinkModal({
    label,
    src,
    isSmall = false,
}: TestLinkModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button
                className="btn"
                onClick={() => dialogRef.current?.showModal()}
            >
                {label}
            </button>
            <dialog ref={dialogRef} className="modal">
                <iframe
                    className={`modal-box w-full ${
                        !isSmall ? "max-w-xl md:max-w-2xl xl:max-w-4xl h-[90vh]" : "h-[40vh]"
                    }  p-0`}
                    src={src}
                >
                    Loading…
                </iframe>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
