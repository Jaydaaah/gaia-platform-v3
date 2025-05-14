import { useState, useMemo } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "./types";
import PDFView from "./partial/PDFView";
import GAIAContainer from "./partial/GAIAContainer";
import NotesSection from "./partial/NotesSection";
import GAIABubble from "./partial/GAIABubble";
import ChatFeed from "./partial/ChatFeed";
import InviteSection from "./partial/InviteSection";
import OnlineSection from "./partial/OnlineSection";
export default function ChatPage() {
    const {
        props: { exam_file, read_only, is_owner, has_rating },
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
                <div className="absolute top-0 right-5 flex">
                    <OnlineSection />
                    {is_owner && <InviteSection />}
                </div>
            </div>
            <div className="h-full flex flex-row-reverse gap-5">
                <div className="w-2/5 xl:w-1/3 flex flex-col px-2">
                    <ChatFeed />
                </div>

                <div className="w-1/2 h-full mx-auto overflow-hidden relative">
                    {!read_only && (
                        <GAIAContainer>
                            <GAIABubble />
                        </GAIAContainer>
                    )}
                    <NotesSection />
                    <PDFView onToggle={(show) => setMoveAside(show)} />
                </div>
            </div>
        </Authenticated>
    );
}
