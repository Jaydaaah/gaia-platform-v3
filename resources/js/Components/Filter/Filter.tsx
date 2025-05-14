import { ChangeEvent, FormEvent, FormHTMLAttributes, useCallback } from "react";

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
                onFilterChange(value);
            }
        },
        [onFilterChange]
    );

    const onReset = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            if (onFilterChange) {
                onFilterChange(null);
            }
        },
        [onFilterChange]
    );

    return (
        <form
            {...props}
            name={name}
            className={`filter ${className ?? ""}`}
            onReset={onReset}
        >
            <input className="btn btn-square" type="reset" value="×" />
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
