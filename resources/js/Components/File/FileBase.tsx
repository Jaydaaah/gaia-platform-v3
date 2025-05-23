export type FileBaseType = React.PropsWithChildren &
    React.HTMLAttributes<HTMLDivElement>;

export default function FileBase({
    className,
    children,
    title,
    ...props
}: FileBaseType) {
    return (
        <div
            {...props}
            tabIndex={0}
            className={`relative p-4 bg-base-200 rounded-lg overflow-clip shadow-sm hover:bg-base-300 flex flex-col items-center justify-center border-2 border-transparent focus:border-base-content ${className}`}
        >
            {children}
            <span className="mt-2 text-sm line-clamp-2 font-medium select-none">
                {title}
            </span>
        </div>
    );
}
