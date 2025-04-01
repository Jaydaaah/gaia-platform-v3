export default function ModalAction({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={`modal-action ${className ?? ""}`} />;
}
