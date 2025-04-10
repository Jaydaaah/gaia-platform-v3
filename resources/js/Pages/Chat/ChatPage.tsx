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
import ChatFeed from "./partial/ChatFeed";

function getAvatarUrl(name: string): string {
    const encodedName = encodeURIComponent(name.trim());
    // return `https://ui-avatars.com/api/?name=${encodedName}`;
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodedName}`;
}

const gaiaSrc = "https://api.dicebear.com/9.x/bottts/svg?seed=Felix";

export default function ChatPage() {
    const {
        props: { exam_file },
    } = usePage<ChatPageProps>();

    const [moveAside, setMoveAside] = useState(false);

    const { subject } = useMemo(() => {
        return exam_file ?? {};
    }, [exam_file]);

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
                    <ChatFeed />
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
