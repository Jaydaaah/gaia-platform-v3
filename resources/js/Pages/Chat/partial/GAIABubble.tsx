import { useCallback, useEffect, useMemo, useState } from "react";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import echo from "@/echo";
import { GAIAResponse, GAIAStatus } from "@/types/Types";
import { useSpeech } from "react-text-to-speech";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function GAIABubble() {
    const {
        props: {
            auth: { user },
            bot_name,
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
            .split("<b>")
            .map((text) => text.replace("\n", "").trim())
            .filter((text) => text.length > 0);
    }, [text]);

    const [textSelect, setTextSelect] = useState(0);

    const [autoPlay, setAutoPlay] = useState(false);

    const { Text, speechStatus, start, pause, stop } = useSpeech({
        text: textArray[textSelect],
        rate: 0.9,
        pitch: 0.8,
        voiceURI: "Google UK English Male",
        autoPlay,
    });

    useEffect(() => {
        setAutoPlay(true);
    }, []);

    const botName = useMemo(() => {
        return bot_name.length ? bot_name : "Sara";
    }, [bot_name]);

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
                return next < textArray.length ? next : 0;
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
            pause();
        } else {
            start();
        }
    }, [pause, start]);

    return (
        <div
            className={`chat chat-start md:text-base lg:text-lg xl:text-xl md:max-w-[50vw]`}
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
                        <BotAvatar className="w-full h-full" name={botName} />
                    </div>
                    <div className="w-full h-full bg-base-300" />
                </div>
            </div>
            <div
                className={`chat-bubble max-h-72 overflow-y-auto select-none min-h-20 min-w-52 transition-all duration-500 ${
                    status === "responded" ? "" : "skeleton opacity-50"
                }`}
            >
                {status === "typing" ? (
                    "typing..."
                ) : (
                    <>
                        <div className="mb-2">{Text()}</div>
                        <div className="flex items-center justify-center gap-3 mt-1">
                            <button
                                onClick={handleLeft}
                                className="text-gray-500 hover:text-gray-800 transition"
                                title="Previous"
                            >
                                <HiChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handlePlayPause}
                                className="text-primary hover:text-primary/80 transition"
                                title={
                                    speechStatus === "started"
                                        ? "Pause"
                                        : "Play"
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
                                className="text-gray-500 hover:text-gray-800 transition"
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
        </div>
    );
}
