import { useEffect, useMemo, useState } from "react";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import echo from "@/echo";
import { GAIAResponse, GAIAStatus } from "@/types/Types";
import { useSpeech } from "react-text-to-speech";

interface GAIABubbleProps {
    moveAside?: boolean;
}
export default function GAIABubble({ moveAside }: GAIABubbleProps) {
    const {
        props: {
            bot_name,
            bot_last_message_content,
            exam_file: { id: exam_id },
        },
    } = usePage<ChatPageProps>();

    const [status, setStatus] = useState<"listening" | "typing" | "responded">(
        "responded"
    );
    const [text, setText] = useState(bot_last_message_content ?? "Hello");

    const [finishSpeacking, setFinishSpeaking] = useState(false);

    const { Text, speechStatus, isInQueue, start, pause, stop } = useSpeech({
        text,
        rate: 0.9,
        pitch: 0.8,
        voiceURI: "Google UK English Male",
    });

    const [hide, setHide] = useState(false);

    useEffect(() => {
        if (!moveAside) {
            setHide(false);
        }
    }, [moveAside]);

    const botName = useMemo(() => {
        return bot_name.length ? bot_name : "Sara";
    }, [bot_name]);

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}`);
        channel.listen("GAIAStatus", ({ exam_file_id, status }: GAIAStatus) => {
            if (exam_id == exam_file_id) {
                if (["listening", "typing", "responded"].includes(status)) {
                    setStatus(status);
                }
            }
        });
        return () => {
            channel.stopListening("UserMessageSent");
        };
    }, [exam_id]);

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}`);
        channel.listen(
            "GAIAResponse",
            ({ exam_file_id, response }: GAIAResponse) => {
                if (exam_id == exam_file_id) {
                    setText(response);
                    setFinishSpeaking(false);
                    stop();
                }
            }
        );
        return () => {
            channel.stopListening("UserMessageSent");
        };
    }, [exam_id, stop]);

    useEffect(() => {
        if (speechStatus == "stopped") {
            setFinishSpeaking(true);
        }
    }, [speechStatus]);

    return (
        <div
            className={`chat chat-start md:text-base lg:text-lg xl:text-xl md:max-w-[50vw]`}
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
            {status != "listening" && (
                <div
                    tabIndex={0}
                    onFocus={() => !finishSpeacking || start()}
                    onClick={() => !!moveAside && setHide((prev) => !prev)}
                    className={`chat-bubble max-h-72 overflow-y-auto select-none min-h-20 min-w-52 ${
                        moveAside
                            ? `${
                                  hide
                                      ? "opacity-20 -translate-x-[100%]"
                                      : "opacity-75"
                              }`
                            : "hover:scale-[102%]s"
                    } transition-all duration-500 ${
                        status == "responded" ? "" : "skeleton opacity-50"
                    }`}
                >
                    {status == "typing" ? "typing..." : Text()}
                </div>
            )}
        </div>
    );
}
