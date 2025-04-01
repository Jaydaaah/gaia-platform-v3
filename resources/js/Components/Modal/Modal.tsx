type ModalProps = {
    _ref: React.RefObject<HTMLDialogElement>;
};
export default function Modal({
    _ref,
    className,
    children,
    ...props
}: ModalProps & React.DialogHTMLAttributes<HTMLDialogElement>) {
    return (
        <dialog
            {...props}
            ref={_ref}
            className={`modal overflow-hidden ${className ?? ""}`}
        >
            {children}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
