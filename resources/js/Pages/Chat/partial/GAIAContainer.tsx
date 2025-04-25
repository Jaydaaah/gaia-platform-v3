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
    return (
        <motion.div
            initial={{
                opacity: 1,
            }}
            whileHover={{ opacity: 1 }}
            className={`fixed z-20 bottom-10 left-10`}
        >
            <div className="flex flex-col-reverse">{children}</div>
        </motion.div>
    );
}
