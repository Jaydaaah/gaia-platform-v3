import { ImgHTMLAttributes, useEffect, useMemo } from "react";

interface AvatarProps {
    name: string;
}
export default function Avatar({
    name,
    ...props
}: AvatarProps & ImgHTMLAttributes<HTMLImageElement>) {
    const srcLink = useMemo(() => {
        const searchParams = new URLSearchParams({ name });
        return `https://ui-avatars.com/api/?${searchParams.toString()}`;
    }, [name]);

    return <img {...props} src={srcLink} />;
}
