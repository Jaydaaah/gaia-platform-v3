import { CgChevronUp } from "react-icons/cg";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    MotionConfig,
} from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";

interface PDFViewProps {
    onToggle?: (show: boolean) => void;
}
export default function PDFView({ onToggle }: PDFViewProps) {
    const {
        props: { exam_file },
    } = usePage<ChatPageProps>();

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (onToggle) {
            onToggle(show);
        }
    }, [show]);

    const sourceFile = useMemo(() => {
        if (exam_file) {
            return route("file-download", exam_file.id);
        }
    }, [exam_file]);

    return (
        <>
            <button className="p-3 invisible">
                <CgChevronUp />
            </button>
            <motion.div
                className="h-full relative"
                initial={{
                    y: "100%",
                }}
                animate={{
                    y: show ? 0 : "100%",
                }}
                transition={{
                    duration: 1,
                    ease: "anticipate",
                }}
            >
                <motion.div
                    className={`absolute w-full flex justify-center`}
                    animate={{
                        top: show ? "-3rem" : "-5rem",
                        rotateZ: show ? 180 : 0,
                    }}
                    transition={{
                        delay: 0.3,
                    }}
                >
                    <button
                        className="p-3 rounded-full text-xl animate-bounce hover:bg-neutral/10"
                        onClick={() => setShow((prev) => !prev)}
                        title="show PDF"
                    >
                        <CgChevronUp />
                    </button>
                </motion.div>
                <iframe
                    className="h-full w-full rounded-t-box"
                    src={`${sourceFile}#toolbar=0`}
                />
            </motion.div>
        </>
    );
}
