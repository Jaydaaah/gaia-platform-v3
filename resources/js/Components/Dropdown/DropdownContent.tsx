import { Children, HTMLAttributes, useMemo } from "react";

interface DropdownContentProps {
    doNotWrap?: boolean;
}
export default function DropdownContent({
    children,
    className = "bg-base-100 rounded-box z-1 w-52 p-2 shadow-xs",
    doNotWrap = false,
    ...props
}: DropdownContentProps & HTMLAttributes<HTMLUListElement>) {
    const modifiedChildren = useMemo(() => {
        if (!doNotWrap) {
            return Children.map(children, (child) => {
                return <li>{child}</li>;
            });
        }
        return children;
    }, [children, doNotWrap]);

    return (
        <ul {...props} className={`menu dropdown-content ${className}`}>
            {modifiedChildren}
        </ul>
    );
}
