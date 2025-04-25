import { Message } from "@/types/Models";
import ReplyNodeItem from "./ReplyNodeItem";
import { User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";

interface ReplyNodeProps {
    user_context: number;
    replies: (Message & { sender: User })[];
}
export default function ReplyNode({ replies, user_context }: ReplyNodeProps) {
    const {
        props: { exam_file },
    } = usePage<ChatPageProps>();

    return (
        <Link
            href={route("chat.show", exam_file.id)}
            data={{
                user_context,
            }}
            className="line-clamp-2 hover:line-clamp-3 hover:opacity-50 cursor-pointer"
        >
            {replies.map((item) => (
                <ReplyNodeItem key={item.id} reply={item} />
            ))}
        </Link>
    );
}
