import { Color, Size } from "@/types/Types";
import { ButtonHTMLAttributes, useMemo } from "react";

interface ButtonProps {
    color: Color;
    size: Size;
}
export default function Button({
    className,
    color,
    size,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
    const colorClass = useMemo(() => {
        return !!color ? `btn-${color}` : "";
    }, [color]);
    const sizeClass = useMemo(() => {
        return !!color ? `btn-${size}` : "";
    }, [size]);

    return (
        <button
            {...props}
            className={`btn ${className ?? ""} ${colorClass} ${sizeClass}`}
        />
    );
}
