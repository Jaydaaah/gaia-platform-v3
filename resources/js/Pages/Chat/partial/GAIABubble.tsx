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

    const [hasUnreadMsg, setHasUnreadMsg] = useState(true);

    const textArray = useMemo(() => {
        return text
            .split("<b>")
            .map((text) => text.replace("\n", "").trim())
            .filter((text) => text.length > 0);
    }, [text]);

    const [textSelect, setTextSelect] = useState(0);

    const { Text, speechStatus, isInQueue, start, pause, stop } = useSpeech({
        text: textArray[textSelect],
        rate: 0.9,
        pitch: 0.8,
        voiceURI: "Google UK English Male",
    });

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
                    setHasUnreadMsg(true);
                    setTextSelect(0);
                    stop();
                }
            }
        );
        return () => {
            channel.stopListening("UserMessageSent");
        };
    }, [exam_id, stop]);

    useEffect(() => {
        if (speechStatus == "started") {
            setHasUnreadMsg(false);
        }
    }, [speechStatus]);

    useEffect(() => {
        if (speechStatus == "stopped" && !hasUnreadMsg) {
            setTextSelect((prev) => {
                const incremented = prev + 1;
                if (textArray.length > incremented) {
                    return incremented;
                }
                return prev;
            });
        }
    }, [speechStatus, hasUnreadMsg, textArray]);

    useEffect(() => {
        console.log(textArray);
    }, [textArray]);

    useEffect(() => {
        console.log(textArray[textSelect]);
    }, [textSelect, textArray]);

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
                    status == "responded" ? "" : "skeleton opacity-50"
                }`}
            >
                {status == "typing" ? "typing..." : Text()}
            </div>
        </div>
    );
}
