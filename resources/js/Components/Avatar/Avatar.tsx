import { funEmoji } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { ImgHTMLAttributes, useEffect, useMemo } from "react";

interface AvatarProps {
    name: string;
}
export default function Avatar({
    name,
    ...props
}: AvatarProps & ImgHTMLAttributes<HTMLImageElement>) {
    const srcLink = useMemo(() => {
        const avatar = createAvatar(funEmoji, { seed: name });
        return avatar.toDataUri();
    }, [name]);

    return <img {...props} src={srcLink} title={name} />;
}
