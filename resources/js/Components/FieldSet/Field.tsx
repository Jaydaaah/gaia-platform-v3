export default function Field({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`input ${className ?? ""}`} />;
}
