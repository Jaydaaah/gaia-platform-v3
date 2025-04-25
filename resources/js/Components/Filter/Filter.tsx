import { ChangeEvent, FormHTMLAttributes, useCallback } from "react";

interface Option {
    label: string;
    value: string;
}

interface FilterProps {
    options: Option[];
    value: string | null;
    onFilterChange?: (selected: string | null) => void;
}
export default function Filter({
    className,
    children,
    options,
    value,
    name,
    onFilterChange,
    ...props
}: FormHTMLAttributes<HTMLFormElement> & FilterProps) {
    if (typeof name != "string") {
        throw new Error("Name is required");
    }

    const onChange = useCallback(
        ({ target: { checked, value } }: ChangeEvent<HTMLInputElement>) => {
            if (checked && onFilterChange) {
                if (value == "x") {
                    onFilterChange(null);
                } else {
                    onFilterChange(value);
                }
            }
        },
        [onFilterChange]
    );

    return (
        <form {...props} name={name} className={`filter ${className ?? ""}`}>
            <input
                className="btn btn-square"
                type="reset"
                value="×"
                onChange={onChange}
            />
            {options.map(({ label, value: val }) => (
                <input
                    key={val}
                    className="btn"
                    type="radio"
                    name={name}
                    aria-label={label}
                    checked={value == val}
                    value={val}
                    onChange={onChange}
                />
            ))}
        </form>
    );
}
