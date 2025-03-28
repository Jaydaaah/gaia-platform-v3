import { InputHTMLAttributes } from "react";

export default function ThemeItem({
    className = "w-full btn btn-sm btn-ghost justify-start",
    title,
    value,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="radio"
            name="theme-dropdown"
            className={`theme-controller ${className}`}
            aria-label={title}
            title={title}
            value={value}
        />
    );
}
