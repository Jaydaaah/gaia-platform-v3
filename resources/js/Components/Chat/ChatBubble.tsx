import { format } from "date-fns";
import { PropsWithChildren, useMemo } from "react";

interface ChatBubbleProps {
    sender: string;
    side: "start" | "end";
    src: string;
    time: string;
}
export default function ChatBubble({
    children,
    sender,
    side,
    src,
    time,
}: PropsWithChildren<ChatBubbleProps>) {
    const formattedTime = useMemo(() => {
        const dateTime = new Date(time);
        const formatted = format(dateTime, "h:mm aaa");
        return formatted;
    }, [time]);

    return (
        <div className={`chat ${side == "end" ? "chat-start" : "chat-start"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={src} alt={sender} />
                </div>
            </div>
            <div className="chat-header">
                {sender}{" "}
                <time className="text-xs opacity-50">{formattedTime}</time>
            </div>
            <div className="chat-bubble">{children}</div>
        </div>
    );
}
