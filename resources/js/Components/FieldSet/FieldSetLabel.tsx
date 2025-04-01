export default function FieldSetLabel({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p {...props} className={`fieldset-label ${className ?? ""}`} />;
}
