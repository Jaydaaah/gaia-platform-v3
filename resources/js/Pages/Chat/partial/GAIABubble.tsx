import { AiFillLock } from "react-icons/ai";
import { AiOutlineUnlock } from "react-icons/ai";
import { useCallback, useEffect, useMemo, useState } from "react";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import echo from "@/echo";
import { GAIAResponse, GAIAStatus } from "@/types/Types";
import { useSpeech, useVoices } from "react-text-to-speech";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { motion } from "motion/react";

export default function GAIABubble() {
    const {
        props: {
            auth: { user },
            bot,
            bot_last_message_content,
            exam_file: { id: exam_id },
        },
    } = usePage<ChatPageProps>();

    const [status, setStatus] = useState<"listening" | "typing" | "responded">(
        "responded"
    );
    const [text, setText] = useState(bot_last_message_content ?? "Hello");
    const [hasUnreadMsg, setHasUnreadMsg] = useState(true);

    const textArray = useMemo(() => {
        return text
            .split("[break]")
            .map((text) => text.replace("\n", "").trim())
            .filter((text) => text.length > 0);
    }, [text]);

    const [textSelect, setTextSelect] = useState(0);

    const [autoPlay, setAutoPlay] = useState(false);

    const [snapBack, setSnapBack] = useState(true);

    const { Text, speechStatus, start, stop } = useSpeech({
        text: textArray[textSelect],
        rate: 0.9,
        pitch: 1,
        voiceURI: bot.voice_uri ?? "Google UK English Male",
        autoPlay,
    });

    useEffect(() => {
        setAutoPlay(true);
    }, []);

    const botName = useMemo(() => {
        return bot.name.length ? bot.name : "Sara";
    }, [bot]);

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}.${user.id}`);
        channel.listen("GAIAStatus", ({ exam_file_id, status }: GAIAStatus) => {
            if (
                exam_id == exam_file_id &&
                ["listening", "typing", "responded"].includes(status)
            ) {
                setStatus(status);
            }
        });
        return () => {
            channel.stopListening("GAIAStatus");
        };
    }, [exam_id, user]);

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}.${user.id}`);
        channel.listen(
            "GAIAResponse",
            ({ exam_file_id, response }: GAIAResponse) => {
                if (exam_id == exam_file_id) {
                    setText(response);
                    setHasUnreadMsg(true);
                    setTextSelect(0);
                    stop();
                }
            }
        );
        return () => {
            channel.stopListening("GAIAResponse");
        };
    }, [exam_id, user, stop]);

    useEffect(() => {
        if (speechStatus === "started") {
            setHasUnreadMsg(false);
        }
    }, [speechStatus]);

    useEffect(() => {
        if (speechStatus === "stopped" && !hasUnreadMsg) {
            setTextSelect((prev) => {
                const next = prev + 1;
                return next < textArray.length ? next : prev;
            });
        }
    }, [speechStatus, hasUnreadMsg, textArray]);

    const handleLeft = useCallback(() => {
        stop();
        setTextSelect((prev) => (prev === 0 ? textArray.length - 1 : prev - 1));
    }, [stop]);

    const handleRight = useCallback(() => {
        stop();
        setTextSelect((prev) => (prev + 1) % textArray.length);
    }, [stop]);

    const handlePlayPause = useCallback(() => {
        if (speechStatus === "started") {
            stop();
            setAutoPlay(false);
        } else {
            start();
            setAutoPlay(true);
        }
    }, [stop, start, speechStatus]);

    return (
        <motion.div
            drag
            dragDirectionLock
            dragMomentum={false}
            dragSnapToOrigin={snapBack}
            className={`chat chat-start md:text-base lg:text-lg xl:text-xl md:max-w-[50vw] cursor-grab active:cursor-grabbing`}
            tabIndex={0}
            onFocus={() =>
                (!!hasUnreadMsg || textSelect + 1 < textArray.length) && start()
            }
        >
            <div
                className={`chat-image avatar ${
                    status == "listening" ? "animate-pulse" : ""
                }`}
            >
                <div className="w-28 rounded-full overflow-clip relative">
                    <div className="absolute p-4">
                        <BotAvatar
                            draggable={false}
                            className="w-full h-full"
                            name={botName}
                        />
                    </div>
                    <div className="w-full h-full bg-base-300/80" />
                </div>
            </div>
            <div
                className={`chat-bubble bg-base-100/90 shadow text-base-content max-h-72 overflow-y-auto select-none min-h-20 min-w-52 transition-all duration-500 relative ${
                    status === "responded" ? "" : "skeleton opacity-50"
                }`}
            >
                {status === "typing" ? (
                    "typing..."
                ) : (
                    <>
                        <button
                            className="absolute left-2 bottom-2 text-gray-500 hover:bg-neutral/10 p-1 rounded-box cursor-pointer text-sm"
                            onClick={() => setSnapBack((prev) => !prev)}
                            title={`Drag origin is ${
                                snapBack ? "lock" : "unlocked"
                            }`}
                        >
                            {snapBack ? <AiFillLock /> : <AiOutlineUnlock />}
                        </button>
                        <div className="mb-2">{Text()}</div>
                        <div className="flex items-center justify-center gap-3 mt-1">
                            <button
                                onClick={handleLeft}
                                className="text-gray-500 hover:text-gray-800 cursor-pointer"
                                title="Previous"
                            >
                                <HiChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handlePlayPause}
                                className="text-primary hover:text-primary/80 cursor-pointer"
                                title={
                                    speechStatus === "started" ? "stop" : "Play"
                                }
                            >
                                {speechStatus === "started" ? (
                                    <FaPause size={18} />
                                ) : (
                                    <FaPlay size={18} />
                                )}
                            </button>
                            <button
                                onClick={handleRight}
                                className="text-gray-500 hover:text-gray-800 cursor-pointer"
                                title="Next"
                            >
                                <HiChevronRight size={18} />
                            </button>
                        </div>
                        <div className="text-[10px] text-gray-400 text-center mt-1">
                            Segment {textSelect + 1} / {textArray.length}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
