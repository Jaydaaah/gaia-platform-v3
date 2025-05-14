import { Message } from "@/types/Models";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { ChatPageProps } from "../types";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import Avatar from "@/Components/Avatar/Avatar";

interface ReplyNodeItemProps {
    reply: Message & { sender: User };
}
export default function ReplyNodeItem({ reply }: ReplyNodeItemProps) {
    const {
        props: { bot },
    } = usePage<ChatPageProps>();

    const avatarNode = useMemo(() => {
        if (reply.is_gaia) {
            return <BotAvatar className="w-4 rounded-full" name={bot.name} />;
        }
        return <Avatar className="w-4 rounded-full" name={reply.sender.name} />;
    }, [reply, bot]);

    return (
        <div className="flex items-center">
            {avatarNode}
            <span className="line-clamp-1 text-muted">{`: ${reply.content}`}</span>
        </div>
    );
}
