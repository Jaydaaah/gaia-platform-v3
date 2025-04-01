import { Color, Size } from "@/types/Types";

type LoadingProps = {
    isSpinner?: boolean;
};
export default function Loading({
    isSpinner = true,
    className,
    children,
    ...props
}: LoadingProps & React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...props}
            className={`loading ${isSpinner ? "loading-spinner" : ""} ${
                className ?? ""
            }`}
        >
            {children}
        </span>
    );
}
