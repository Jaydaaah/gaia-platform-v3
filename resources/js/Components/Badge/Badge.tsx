import { Color, Size } from "@/types/Types";
import { HTMLAttributes, useMemo } from "react";

interface BadgeProps {
    color?: Color;
    size?: Size;
}
export default function Badge({
    className,
    color,
    size,
    ...props
}: HTMLAttributes<HTMLSpanElement> & BadgeProps) {
    const colorClass = useMemo(() => {
        return !!color ? `badge-${color}` : "";
    }, [color]);
    const sizeClass = useMemo(() => {
        return !!color ? `badge-${size}` : "";
    }, [size]);

    return (
        <span
            {...props}
            className={`badge ${className ?? ""} ${colorClass} ${sizeClass}`}
        />
    );
}
