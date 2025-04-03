export default function FieldArea({
    className,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={`input ${className ?? ""}`} />;
}
