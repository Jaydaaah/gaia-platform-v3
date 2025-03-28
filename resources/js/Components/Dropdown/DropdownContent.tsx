import { Children, HTMLAttributes, useMemo } from "react";

export default function DropdownContent({
    children,
    className = "bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm",
    ...props
}: HTMLAttributes<HTMLUListElement>) {
    const modifiedChildren = useMemo(() => {
        return Children.map(children, (child) => {
            return <li>{child}</li>;
        });
    }, [children]);

    return (
        <ul {...props} className={`menu dropdown-content`}>
            {modifiedChildren}
        </ul>
    );
}
