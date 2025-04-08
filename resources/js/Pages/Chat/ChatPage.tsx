import { MdNotes } from "react-icons/md";
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
import { ChatPageProps } from "./types";
import PDFView from "./partial/PDFView";
import GAIAContainer from "./partial/GAIAContainer";
import NotesSection from "./partial/NotesSection";
import GAIABubble from "./partial/GAIABubble";
import echo from "@/echo";
import { UserMessageSent } from "@/types/Types";

function getAvatarUrl(name: string): string {
    const encodedName = encodeURIComponent(name.trim());
    // return `https://ui-avatars.com/api/?name=${encodedName}`;
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodedName}`;
}

const gaiaSrc = "https://api.dicebear.com/9.x/bottts/svg?seed=Felix";

export default function ChatPage() {
    const {
        props: {
            exam_file,
            messages: message_raw,
            auth: { user },
        },
    } = usePage<ChatPageProps>();

    const [moveAside, setMoveAside] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const { subject, id: exam_id } = useMemo(() => {
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
                        src: !is_gaia ? getAvatarUrl(sender.name) : gaiaSrc,
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

    return (
        <Authenticated>
            {/* Topic Title */}
            <div className="p-4 my-2 w-full mx-auto relative">
                <h2 className="text-2xl font-semibold text-center">
                    Topic: {subject}
                </h2>
                <NotesSection />
            </div>
            <div className="h-full flex flex-row-reverse gap-5">
                <div className="w-2/5 xl:w-1/3 flex flex-col px-2">
                    <div className="flex-grow w-full max-w-7xl flex flex-col">
                        {/* Header */}
                        <div className="p-4 rounded-box bg-primary text-primary-content flex justify-between items-center">
                            <h1 className="text-lg font-bold">Chat Room</h1>
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() =>
                                    router.visit(route("dashboard.index"))
                                }
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

                <div className="w-1/2 h-full mx-auto overflow-hidden">
                    <GAIAContainer moveAside={moveAside}>
                        <GAIABubble moveAside={moveAside} />
                    </GAIAContainer>
                    <PDFView onToggle={(show) => setMoveAside(show)} />
                </div>
            </div>
        </Authenticated>
    );
}
