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
import BotAvatar from "@/Components/Avatar/BotAvatar";
import { useSwal } from "@/Hook/SweetAlert/useSwal";
import { p } from "motion/react-client";

export default function ChatFeed() {
    const swal = useSwal();

    const {
        props: {
            exam_file,
            messages,
            auth: { user },
            user_context,
            bot,
            has_rating,
        },
    } = usePage<ChatPageProps>();

    const chatEndRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    const onReset = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            if (swal) {
                swal.fire({
                    title: "Are you sure you want to leave the chat room?",
                    text: "Thank you for using GAIA — your interactive learning platform. We hope you enjoyed your session!",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#FF746C",
                    cancelButtonColor: "#6c757d",
                    confirmButtonText: "Leave",
                    cancelButtonText: "Stay",
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (!has_rating) {
                            swal.fire({
                                title: "We'd love your feedback!",
                                text: "Would you like to rate your experience with GAIA?",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonColor: "#FF746C",
                                cancelButtonColor: "#6c757d",
                                confirmButtonText: "Rate Now",
                                cancelButtonText: "Maybe Later",
                            }).then((rateResult) => {
                                if (rateResult.isConfirmed) {
                                    router.visit("/rate-us/create"); // Adjust if using a named route
                                } else {
                                    router.visit(route("dashboard.index"));
                                }
                            });
                        } else {
                            router.visit(route("dashboard.index"));
                        }
                    }
                });
            }
        },
        [swal, has_rating]
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
                            onClick={() => formRef.current?.reset()}
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
                                        <BotAvatar name={bot.name} />
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
                                sender={!is_gaia ? sender?.name : bot.name}
                                time={created_at}
                            >
                                {content.split("[break]").join("\n\n")}
                            </ChatBubble>
                        )
                    )}
                </>
            </div>

            {/* Chat Input */}
            <form ref={formRef} onSubmit={onSubmit} onReset={onReset}>
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
