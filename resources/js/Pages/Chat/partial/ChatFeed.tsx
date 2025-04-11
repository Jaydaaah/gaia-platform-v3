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

export default function ChatFeed() {
    const {
        props: {
            exam_file,
            messages: message_raw,
            auth: { user },
        },
    } = usePage<ChatPageProps>();

    const chatEndRef = useRef<HTMLDivElement>(null);

    const { id: exam_id } = useMemo(() => {
        return exam_file ?? {};
    }, [exam_file]);

    const messages = useMemo(() => {
        if (Array.isArray(message_raw)) {
            return message_raw
                .filter(({ is_gaia }) => !is_gaia)
                .map(({ id, sender, created_at, content, is_gaia }) => {
                    return {
                        id,
                        is_gaia,
                        content,
                        created_at,
                        sender: sender.name,
                    };
                });
        }
        return [];
    }, [message_raw]);

    const { data, setData, processing, errors, patch } = useForm({
        content: "",
    });

    const [status, setStatus] = useState<"listening" | "typing" | "responded">(
        "responded"
    );

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            patch(route("chat.update", exam_id), {
                onSuccess: () => {
                    setData({ content: "" });
                },
            });
        },
        [patch, exam_id]
    );

    useEffect(() => {
        const channel = echo.private(`chat-window.${exam_id}`);
        channel.listen(
            "UserMessageSent",
            ({ exam_file_id, sender_id }: UserMessageSent) => {
                if (exam_file_id == exam_id && user.id != sender_id) {
                    router.reload({
                        only: ["messages"],
                    });
                }
            }
        );
        return () => {
            channel.stopListening("UserMessageSent");
        };
    }, [exam_id, user]);

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

    return (
        <div className="flex-grow w-full max-w-7xl flex flex-col">
            {/* Header */}
            <div className="p-4 rounded-box bg-primary text-primary-content flex justify-between items-center">
                <h1 className="text-lg font-bold">Chat Room</h1>
                <button
                    className="btn btn-sm btn-error"
                    onClick={() => router.visit(route("dashboard.index"))}
                >
                    Leave Chat
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow h-0 overflow-y-auto p-4 space-y-3 flex flex-col-reverse bg-base-100/50">
                <div ref={chatEndRef} />
                {/* chat here */}
                <>
                    {messages.map(
                        ({ id, content, is_gaia, sender, created_at }) => (
                            <ChatBubble
                                avatarNode={<Avatar name={sender} />}
                                key={id}
                                side={is_gaia ? "start" : "end"}
                                sender={sender}
                                time={created_at}
                            >
                                {content}
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
