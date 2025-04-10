import { useEffect, useRef, useLayoutEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { PropsWithChildren } from "react";

interface GAIACharProps {
    moveAside?: boolean;
}

export default function GAIAContainer({
    children,
    moveAside,
}: PropsWithChildren<GAIACharProps>) {
    const divAnimate = useAnimationControls();
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const element = containerRef.current;
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const distanceToBottom = viewportHeight - rect.top - (rect.height + 30);

        divAnimate.start({
            y: !moveAside ? 0 : distanceToBottom,
            scale: !moveAside ? 1.2 : 1,
        });
    }, [moveAside]);

    return (
        <motion.div
            ref={containerRef}
            className={`fixed z-20 top-1/3`}
            animate={divAnimate}
        >
            <div className="flex flex-col-reverse">{children}</div>
        </motion.div>
    );
}
