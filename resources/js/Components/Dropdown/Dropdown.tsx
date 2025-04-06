import { DetailsHTMLAttributes } from "react";

interface DropdownProps {}
export default function Dropdown({
    className,
    children,
    ...props
}: DetailsHTMLAttributes<HTMLDetailsElement>) {
    return (
        <details {...props} className={`dropdown ${className ?? ""}`}>
            {children}
        </details>
    );
}
