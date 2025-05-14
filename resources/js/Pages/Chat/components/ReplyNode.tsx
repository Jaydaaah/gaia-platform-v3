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
            only={["messages", "note", "user_context", "read_only",]}
            className="max-w-28 md:max-w-32 lg:max-w-52 hover:opacity-50 cursor-pointer bg-base-300/50 p-1 mt-0.5 rounded-box"
        >
            {replies.map((item) => (
                <ReplyNodeItem key={item.id} reply={item} />
            ))}
        </Link>
    );
}
