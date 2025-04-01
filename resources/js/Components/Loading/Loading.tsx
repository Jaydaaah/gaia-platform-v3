import { Color, Size } from "@/types/Types";

export default function Loading({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...props}
            className={`loading loading-spinner ${className ?? ""}`}
        >
            {children}
        </span>
    );
}
