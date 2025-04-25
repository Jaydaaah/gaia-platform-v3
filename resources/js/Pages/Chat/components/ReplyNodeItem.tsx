import { Message } from "@/types/Models";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { ChatPageProps } from "../types";

interface ReplyNodeItemProps {
    reply: Message & { sender: User };
}
export default function ReplyNodeItem({ reply }: ReplyNodeItemProps) {
    const {
        props: { bot_name },
    } = usePage<ChatPageProps>();

    const name = useMemo(() => {
        if (reply.is_gaia) {
            return bot_name;
        }
        return reply.sender.name;
    }, [reply, bot_name]);

    return (
        <div>
            <span>{"+   "}</span>
            <span className="">{`${name}: `}</span>
            <span className="text-truncate text-muted">{reply.content}</span>
        </div>
    );
}
