export default function FieldSet({
    className,
    ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
    return <fieldset {...props} className={`fieldset ${className ?? ""}`} />;
}
