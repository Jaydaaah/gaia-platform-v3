export default function ModalBox({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={`modal-box ${className ?? ""}`} />;
}
