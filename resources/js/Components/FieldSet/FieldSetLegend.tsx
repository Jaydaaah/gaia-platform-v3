export default function FieldSetLegend({
    className,
    ...props
}: React.HTMLAttributes<HTMLLegendElement>) {
    return (
        <legend {...props} className={`fieldset-legend ${className ?? ""}`} />
    );
}
