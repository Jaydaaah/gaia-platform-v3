import {
    useState,
    useEffect,
    useRef,
    useCallback,
    FormEvent,
    useMemo,
} from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ChatBubble from "@/Components/Chat/ChatBubble";
import ChatInput from "@/Components/Chat/ChatInput";
import { Deferred, router, useForm, usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import echo from "@/echo";
import { GAIAStatus, UserMessageSent } from "@/types/Types";
import Avatar from "@/Components/Avatar/Avatar";
import ReplyNode from "../components/ReplyNode";
import GAIABubble from "./GAIABubble";
import BotAvatar from "@/Components/Avatar/BotAvatar";

export default function ChatFeed() {
    const {
        props: {
            exam_file,
            messages,
            auth: { user },
            user_context,
            bot_name,
        },
    } = usePage<ChatPageProps>();

    const chatEndRef = useRef<HTMLDivElement>(null);

    const { id: exam_id } = useMemo(() => {
        return exam_file ?? {};
    }, [exam_file]);

    const { data, setData, processing, errors, patch } = useForm({
        content: "",
        user_context,
    });

    const [status, setStatus] = useState<"listening" | "typing" | "responded">(
        "responded"
    );

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            patch(route("chat.update", exam_id), {
                onSuccess: () => {
                    setData("content", "");
                },
            });
        },
        [patch, exam_id]
    );

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}`);
        channel.listen(
            ".user.message.sent",
            ({ exam_file_id, sender_id }: UserMessageSent) => {
                if (exam_file_id == exam_id && user.id != sender_id) {
                    router.reload({
                        only: ["messages"],
                    });
                }
            }
        );
        return () => {
            channel.stopListening(".user.message.sent");
        };
    }, [exam_id, user]);

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}.${user.id}`);
        channel.listen("GAIAStatus", ({ exam_file_id, status }: GAIAStatus) => {
            if (exam_id == exam_file_id) {
                if (["listening", "typing", "responded"].includes(status)) {
                    setStatus(status);
                    router.reload({
                        only: ["messages"],
                    });
                }
            }
        });
        return () => {
            channel.stopListening("GAIAStatus");
        };
    }, [exam_id, user]);

    return (
        <div className="flex-grow w-full max-w-7xl flex flex-col">
            {/* Header */}
            <div className="relative">
                <div className="p-4 rounded-box bg-primary text-primary-content flex justify-between items-center">
                    <h1 className="text-lg font-bold">Chat Room</h1>
                    <div className="flex gap-2">
                        {!!user_context && (
                            <button
                                className="btn btn-sm btn-warning"
                                onClick={() =>
                                    router.visit(
                                        route("chat.show", exam_file.id)
                                    )
                                }
                            >
                                Go Back
                            </button>
                        )}
                        <button
                            className="btn btn-sm btn-error"
                            onClick={() =>
                                router.visit(route("dashboard.index"))
                            }
                        >
                            Leave Chat
                        </button>
                    </div>
                </div>

                {/* <ChatFilter /> */}
            </div>

            {/* Chat Messages */}
            <div className="flex-grow h-0 overflow-y-auto p-4 space-y-3 flex flex-col-reverse bg-base-100/50">
                <div ref={chatEndRef} />
                {/* chat here */}
                <>
                    {messages?.map(
                        ({
                            id,
                            content,
                            is_gaia,
                            sender,
                            created_at,
                            reply_from,
                        }) => (
                            <ChatBubble
                                avatarNode={
                                    is_gaia ? (
                                        <BotAvatar name={bot_name} />
                                    ) : (
                                        <Avatar name={sender?.name} />
                                    )
                                }
                                footer={
                                    reply_from &&
                                    reply_from.length > 0 && (
                                        <ReplyNode
                                            replies={reply_from}
                                            user_context={sender.id}
                                        />
                                    )
                                }
                                key={id}
                                side={
                                    is_gaia || sender?.id != user.id
                                        ? "start"
                                        : "end"
                                }
                                sender={!is_gaia ? sender?.name : bot_name}
                                time={created_at}
                            >
                                {content.split("<b>").join("\n\n")}
                            </ChatBubble>
                        )
                    )}
                </>
            </div>

            {/* Chat Input */}
            <form onSubmit={onSubmit}>
                <ChatInput
                    onChange={({ target }) => setData("content", target.value)}
                    value={data.content}
                    error={errors.content}
                    processing={processing}
                    disabled={status == "typing"}
                />
            </form>
        </div>
    );
}
