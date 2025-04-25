import { format } from "date-fns";
import { PropsWithChildren, ReactNode, useMemo } from "react";

interface ChatBubbleProps {
    sender: string;
    side: "start" | "end";
    avatarNode: ReactNode;
    footer?: ReactNode;
    time: string;
}
export default function ChatBubble({
    children,
    sender,
    side,
    avatarNode,
    footer,
    time,
}: PropsWithChildren<ChatBubbleProps>) {
    const formattedTime = useMemo(() => {
        const dateTime = new Date(time);
        const formatted = format(dateTime, "h:mm aaa");
        return formatted;
    }, [time]);

    return (
        <div className={`chat ${side == "end" ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">{avatarNode}</div>
            </div>
            <div className="chat-header">
                {sender}{" "}
                <time className="text-xs opacity-50">{formattedTime}</time>
            </div>
            <div className="chat-bubble">{children}</div>
            <div className="chat-footer ">{footer}</div>
        </div>
    );
}
