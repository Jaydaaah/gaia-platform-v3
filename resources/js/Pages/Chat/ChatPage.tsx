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
import { Deferred, useForm, usePage, usePoll } from "@inertiajs/react";
import { ChatPageProps } from "./types";
import Loading from "@/Components/Loading/Loading";

function getAvatarUrl(name: string): string {
    const encodedName = encodeURIComponent(name.trim());
    return `https://ui-avatars.com/api/?name=${encodedName}`;
}

const gaiaSrc = "https://api.dicebear.com/9.x/bottts/svg?seed=Felix";

export default function ChatPage() {
    const {
        props: { exam_file, messages: message_raw },
    } = usePage<ChatPageProps>();

    const { start, stop } = usePoll(1000, { only: ["messages"] });

    const chatEndRef = useRef<HTMLDivElement>(null);

    const { subject, id: exam_id } = useMemo(() => {
        return exam_file ?? {};
    }, [exam_file]);

    const messages = useMemo(() => {
        if (Array.isArray(message_raw)) {
            return message_raw.map(
                ({ id, sender, created_at, content, is_gaia }) => {
                    return {
                        id,
                        is_gaia,
                        content,
                        src: !is_gaia ? getAvatarUrl(sender.name) : gaiaSrc,
                        created_at,
                        sender: sender.name,
                    };
                }
            );
        }
        return [];
    }, [message_raw]);

    const { data, setData, processing, errors, patch } = useForm({
        content: "",
    });

    useEffect(() => {
        if (processing) {
            stop();
        } else {
            start();
        }
    }, [processing]);

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

    return (
        <Authenticated>
            <div className="flex flex-col items-center">
                <div className="w-full max-w-7xl flex flex-col h-full relative">
                    <div className="absolute -z-10 backdrop-blur-md bg-base-200 h-screen w-full"></div>
                    {/* Header */}
                    <div className="p-4 rounded-box bg-primary text-primary-content flex justify-between items-center">
                        <h1 className="text-lg font-bold">Chat Room</h1>
                        <button
                            className="btn btn-sm btn-error"
                            onClick={() => window.history.back()}
                        >
                            Leave Chat
                        </button>
                    </div>

                    {/* Topic Title */}

                    {/* Chat Messages */}
                    <div className="flex-1 max-h-[100vh] overflow-y-auto p-4 space-y-3 flex flex-col-reverse">
                        <div ref={chatEndRef} />
                        {/* chat here */}
                        <>
                            {messages.map(
                                ({
                                    id,
                                    content,
                                    src,
                                    is_gaia,
                                    sender,
                                    created_at,
                                }) => (
                                    <ChatBubble
                                        key={id}
                                        src={src}
                                        side={is_gaia ? "start" : "end"}
                                        sender={sender}
                                        time={created_at}
                                    >
                                        {content}
                                    </ChatBubble>
                                )
                            )}
                        </>

                        <div className="p-4 my-4 w-fit mx-auto">
                            <h2 className="text-2xl font-semibold">
                                Topic: {subject}
                            </h2>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={onSubmit}>
                        <ChatInput
                            onChange={({ target }) =>
                                setData("content", target.value)
                            }
                            value={data.content}
                            error={errors.content}
                            processing={processing}
                        />
                    </form>
                </div>
            </div>
        </Authenticated>
    );
}
